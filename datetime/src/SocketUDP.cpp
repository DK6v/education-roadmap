#include <cstdlib>
#include <cstring>
#include <unistd.h>
#include <iostream>
#include <mutex>

#include <errno.h>
#include <fcntl.h>
#include <netdb.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>

#include "SocketUDP.h"

using namespace std;

int MessageUDP::resolve(const std::string hostname, int port) {

    int rc = 0;
    addrinfo* result_list = NULL;
    addrinfo hints = {
        hints.ai_family = AF_INET,
        // without this flag, getaddrinfo will return 3x the number of addresses
        // (one for each socket type).
        hints.ai_socktype = SOCK_DGRAM,
    };

    rc = getaddrinfo(hostname.c_str(), std::to_string(port).c_str(), &hints, &result_list);
    if (rc == 0) {
        memcpy(&address, result_list->ai_addr, result_list->ai_addrlen);
        freeaddrinfo(result_list);
    }

    return rc;
}

SocketUDP::SocketUDP() {

    struct timeval timeout = {
        .tv_sec = 0,
        .tv_usec = 100'000, // ms
    };

    if ((sockfd_ = socket(AF_INET, SOCK_DGRAM, 0)) == (-1)) {
        std::cout << "[socket] failed to create" << std::endl;
        return;
    }

    if (setsockopt(sockfd_, SOL_SOCKET, SO_RCVTIMEO, &timeout, sizeof(timeout)) == (-1)) {
        std::cerr << "setsockopt error" << std::endl;
    }

    int send_buf_size = 1024 * 1024 * 1 /* MB */;
    if (setsockopt(sockfd_, SOL_SOCKET, SO_SNDBUF, &send_buf_size, sizeof(int)) == (-1)) {
        std::cerr << "setsockopt error" << std::endl;
    }

    int recv_buf_size = 1024 * 1024 * 1 /* MB */;
    if (setsockopt(sockfd_, SOL_SOCKET, SO_RCVBUF, &recv_buf_size, sizeof(int)) == (-1)) {
        std::cerr << "setsockopt error" << std::endl;
    }

    std::cout << "[socket] created succesfully" << std::endl;
}

SocketUDP::~SocketUDP() {
    if (sockfd_ != (-1)) {
        close(sockfd_);
        std::cout << "[socket] closed" << std::endl;
    }
}

SocketUDP::SocketUDP(const SocketUDP & other) {
    *this = other;
}

SocketUDP & SocketUDP::operator=(const SocketUDP & other) {
    *this = other;
    return *this;
}

int SocketUDP::bind() {
    return bind(0 /* any port */);
}

int SocketUDP::bind(uint16_t port) {

    int rc = ENOERR;

    std::memset(&address_, 0, sizeof(address_));
    address_.sin_family = AF_INET; // IPv4
    address_.sin_addr.s_addr = INADDR_ANY;
    address_.sin_port = htons(port);

    rc = ::bind(sockfd_, (const struct sockaddr *)&address_, sizeof(address_));
    if (rc == (-1)) {
        std::cout << "[socket] failed to bind" << std::endl;
        return errno;
    }

    socklen_t addrlen = sizeof(address_);
    getsockname(sockfd_, (struct sockaddr *)&address_, &addrlen);

    std::cout
        << std::format(
            "[socket] bound port {} succesfully", ntohs(address_.sin_port))
        << std::endl;

    return ENOERR;
}

int SocketUDP::receive_m(MessageUDP *msg_p) {

    socklen_t addressLength = sizeof(msg_p->address);

    const std::lock_guard<std::mutex> lock(recv_lock_);

    if (msg_p == nullptr) {
        return ENOENT;
    }

    int size = ::recvfrom(
        sockfd_,
        msg_p->data.data(),
        msg_p->data.size(),
        MSG_WAITALL, /* flags */
        &msg_p->address,
        &addressLength);

    if (size == (-1)) {
        msg_p->size = 0;
        return EINVAL;
    }

    msg_p->size = size;
    return ENOERR;
}

int SocketUDP::send(MessageUDP & message) {
    return send(
        message,
        std::string(message.data.begin(),
                    message.data.begin() + message.size));
}

int SocketUDP::send(MessageUDP & message ,std::string data) {

    int length = 0;

    const std::lock_guard<std::mutex> lock(send_lock_);

    length = sendto(
        sockfd_,
        data.c_str(),
        data.length(),
        MSG_CONFIRM,
        &message.address,
        sizeof(message.address));

    return length;
}

std::string SocketUDP::to_string(const struct sockaddr & address) {

    char name[INET6_ADDRSTRLEN] = {0};

    int rc =
        getnameinfo(&address, sizeof(address),
            name, sizeof(name),
            nullptr, 0, /* port */
            NI_NUMERICHOST);

    if(rc != ENOERR) {
        return std::string();
    }

    return std::string(name);
}