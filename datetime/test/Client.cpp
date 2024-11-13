#include <cstdlib>
#include <cstring>
#include <format>
#include <unistd.h>
#include <iostream>
#include <sstream>
#include <mutex>
#include <thread>

#include <fcntl.h>
#include <signal.h>
#include <sys/socket.h>
#include <netinet/in.h>

#include "Client.h"
#include "../src/SocketUDP.h"
#include "../src/MessageQueue.h"

using namespace std;

std::atomic<bool> quit(false);

void handleSiging(int signo){
    cout << "Caught signal SIGINT(" << signo << "), terminating..." << endl;
    quit.store(true);
}

int main(int argc, char *argv[]) {

    signal(SIGINT, handleSiging);

    std::string host = "localhost";
    if (argc > 1) {
        std::istringstream ss(argv[1]);
        if (!(ss >> host)) {
            std::cerr << "Invalid string" << endl;
            exit(EINVAL);
        }
    }

    auto port = 12345;
    if (argc > 2) {
        std::istringstream ss(argv[2]);
        if (!(ss >> port)) {
            std::cerr << "Invalid number" << endl;
            exit(EINVAL);
        }
    }

    unsigned int count = 1;
    if (argc > 3) {
        std::istringstream ss(argv[3]);
        if (!(ss >> count)) {
            std::cerr << "Invalid number" << endl;
            exit(EINVAL);
        }
    }

    auto socket = SocketUDP();
    if (socket.bind() == EXIT_FAILURE) {
        std::cout << "Exit failure!" << endl;
        exit(EXIT_FAILURE);
    }

    std::atomic_uint seqNo = {0};

    auto sender = [&socket, &seqNo, count, host, port]() mutable {
        while(!quit && (seqNo < count)) {
            MessageUDP msg = {0};
            msg.resolve(host, port);
            msg.data = { "test_client" };
            msg.size = strlen(msg.data.data());
            socket.send(msg);
            ++seqNo;
        }
        std::cout << "[sender] done" << endl;
    };

    for (auto ix = 0; ix < 1; ++ix) {
        std::thread(sender).detach();
    }

    std::atomic_uint recvCounter = {0};

    auto receiver = [count, &recvCounter, &socket]() mutable {
        MessageUDP msg = { .size = 0};
        while (!quit && (recvCounter < count)) {
            if (socket.receive_m(&msg) == ENOERR) {
                auto epoch = ((uint32_t*)msg.data.data())[0];
                std::cout
                    << std::format("[receive] {}", epoch)
                    << std::endl;
                ++recvCounter;
            }
        }
    };
    std::thread(receiver).join();

    if (recvCounter != count) {
        std::cout << "[missed] " << count - recvCounter << endl;
    }

    std::cout << "[total] " << recvCounter << endl;

    return 0;
}