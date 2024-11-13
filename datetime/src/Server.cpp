#include <atomic>
#include <iostream>
#include <sstream>
#include <thread>
#include <chrono>
#include <ctime>
#include <map>

#include <errno.h>
#include <signal.h>

#include "SocketUDP.h"
#include "MessageQueue.h"

using namespace std;
using namespace std::chrono;

std::atomic<bool> quit(false);

void handleSignal(int signo){
    cout << "Caught signal SIGINT(" << signo << "), terminating..." << endl;
    quit.store(true);
}

int main(int argc, char *argv[]) {

    signal(SIGINT, handleSignal);

    auto port = 12345;
    if (argc > 1) {
        std::istringstream ss(argv[1]);
        if (!(ss >> port)) {
            std::cerr << "Invalid number" << endl;
            exit(EINVAL);
        }
        else if (!ss.eof())
        {
            std::cerr << "Trailing characters after number" << endl;
            exit(EINVAL);
        }
    }

    auto queue = std::make_shared<MessageQueue>();
    Message<MessageUDP>::preallocate(100);

    auto socket = SocketUDP();
    if (socket.bind(port) == EXIT_FAILURE) {
        exit(EXIT_FAILURE);
    }

    std::map<std::string, int64_t> cache;
    std::mutex mutex;

    auto receiver = [&]() mutable {

        std::shared_ptr<Message<MessageUDP>> msg_p = nullptr;

        while (!quit) {

            if (msg_p == nullptr) {
                msg_p = Message<MessageUDP>::allocate(Signals::DATAGRAMM);
                continue;
            }

            if (socket.receive_m(&msg_p->msg) == ENOERR) {

                std::string name;
                if (msg_p->msg.size != 0) {
                    name = std::string(
                        msg_p->msg.data.begin(),
                        msg_p->msg.data.begin() + std::min(msg_p->msg.size, 16UL));
                }

                auto addr = SocketUDP::to_string(msg_p->msg.address);

                auto now = std::chrono::system_clock::now().time_since_epoch();
                auto epoch = std::chrono::duration_cast<std::chrono::seconds>(now).count();

                int64_t duration = 0;

                {
                    const std::lock_guard<std::mutex> lock(mutex);

                    auto it = cache.find(addr);
                    if (it != cache.end()) {
                        duration = epoch - it->second;
                        it->second = epoch;
                    } else {
                        cache.emplace(std::make_pair(addr, epoch));
                    }
                }

                std::cout
                    << std::format("-- {} {:5} => {} * {}",
                        epoch, duration, addr, name)
                    << std::endl;

               ((uint32_t*)msg_p->msg.data.data())[0] = static_cast<uint32_t>(epoch);
                msg_p->msg.size = sizeof(uint32_t);

                queue->send(msg_p);
                msg_p = nullptr;
            }
        }
    };
    for (auto ix = 0; ix < 1; ++ix) {
        std::thread(receiver).detach();
    }

    auto sender = [&]() mutable {
        uint count = 0;
        while(!quit) {
            auto msg_p = std::dynamic_pointer_cast<Message<MessageUDP>>(queue->receive());
            if (msg_p != nullptr) {
                auto time = system_clock::now();
                int rc = socket.send(msg_p->msg);
                msg_p->free();
            }
        }
    };
    for (auto ix = 0; ix < 1; ++ix) {
        std::thread(sender).detach();
    }

    auto start = std::chrono::system_clock::now().time_since_epoch();

    while (!quit) {

        std::this_thread::sleep_for(100ms);

        auto now = std::chrono::system_clock::now().time_since_epoch();
        if ((now - start) > 15s) {
            start = now;

            auto removeOlderThan = std::chrono::duration_cast<seconds>(now - 2h).count();
            const std::lock_guard<std::mutex> lock(mutex);

            std::erase_if(cache,
                [removeOlderThan](const auto& item) {
                    return (removeOlderThan > item.second);
                }
            );
        }
    }

    return 0;
}