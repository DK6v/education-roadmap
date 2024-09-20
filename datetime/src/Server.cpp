#include <atomic>
#include <iostream>
#include <sstream>
#include <thread>
#include <chrono>
#include <ctime>

#include <errno.h>
#include <signal.h>

#include "SocketUDP.h"
#include "MessageQueue.h"


using namespace std;
using namespace std::chrono;

std::atomic<bool> quit(false);

void my_handler(int signo){
    cout << "Caught signal SIGINT(" << signo << "), terminating..." << endl;
    quit.store(true);
}

int main(int argc, char *argv[]) {

    signal(SIGINT, my_handler);

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
    Message<QMessageUDP>::preallocate(10);

    auto socket = SocketUDP();
    if (socket.bind(port) == EXIT_FAILURE) {
        exit(EXIT_FAILURE);
    }

    auto worker = [&]() mutable {
        while(!quit) {
            auto msg_p = std::dynamic_pointer_cast<Message<QMessageUDP>>(queue->receive());
            if (msg_p != nullptr) {
                auto time = system_clock::now();
                int rc = socket.send(msg_p->data,
                                     std::to_string(system_clock::to_time_t(time)));
                msg_p->free();
            }
        }
    };

    for (auto ix = 0; ix < 2; ++ix) {
        std::thread(worker).detach();
    }

    std::shared_ptr<Message<QMessageUDP>> msg_p = nullptr;
    while (!quit) {
        if (msg_p == nullptr) {
            msg_p = Message<QMessageUDP>::allocate(Signals::DATAGRAMM);
            continue;
        }

        if (socket.receive_m(&msg_p->data)) {
            
            queue->send(msg_p);
            msg_p = nullptr;
        }
    }

    return 0;
}