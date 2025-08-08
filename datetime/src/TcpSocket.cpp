#include <cstdlib>
#include <cstring>
#include <unistd.h>
#include <iostream>
#include <mutex>
#include <format>

#include <errno.h>
#include <fcntl.h>
#include <netdb.h>
#include <sys/time.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>

#include "TcpSocket.h"

using namespace TCP;

TcpSocket::TcpSocket() {

    struct timeval timeout = {
        .tv_sec = 0,
        .tv_usec = 100'000, // ms
    };

    if ((sockfd_ = socket(AF_INET, SOCK_STREAM, 0)) == (-1)) {
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

    const int enabled = 1;
    if (setsockopt(sockfd_, SOL_SOCKET, SO_REUSEADDR, &enabled, sizeof(int)) == (-1)) {
        std::cerr << "setsockopt SO_REUSEADDR failed" << std::endl;
    }

    std::cout << "[socket] created succesfully" << std::endl;
}

TcpSocket::~TcpSocket() {
    if (sockfd_ != (-1)) {
        close(sockfd_);
        std::cout << "[socket] closed" << std::endl;
    }
    TcpConnection cn;
}

TcpSocket::TcpSocket(const TcpSocket & other) {
    *this = other;
}

TcpSocket & TcpSocket::operator=(const TcpSocket & other) {
    *this = other;
    return *this;
}

int TcpSocket::listen(uint16_t port, uint32_t maxConn) {

    int rc = ENOERR;

    std::memset(&address_, 0, sizeof(address_));
    address_.sin_family = AF_INET; // IPv4
    address_.sin_addr.s_addr = INADDR_ANY;
    address_.sin_port = htons(port);

    rc = ::bind(sockfd_, (const struct sockaddr *)&address_, sizeof(address_));
    if (rc == (-1)) {
        std::cout
            << std::format(
                "[socket] failed to bind port {}, rc={} ({})",
                port, errno, strerror(errno))
            << std::endl;
        return errno;
    }

    socklen_t addrlen = sizeof(address_);
    ::getsockname(sockfd_, (struct sockaddr *)&address_, &addrlen);

    std::cout
        << std::format(
            "[socket] bound port {} succesfully",
            ntohs(address_.sin_port))
        << std::endl;

    rc = ::listen(sockfd_, maxConn);
    if (rc == (-1)) {
        std::cout 
            << std::format(
                "[socket] failed to listen port {}, maxConn={}",
                ntohs(address_.sin_port), maxConn)
            << std::endl;
        return errno;
    }

    std::cout
        << std::format(
            "[socket] listen port {}, maxConn={}",
            ntohs(address_.sin_port), maxConn)
        << std::endl;

    return ENOERR;
}

int TcpSocket::accept(TcpConnection* connection_p) {

    if (connection_p == nullptr) {
        return ENOENT;
    }

    {
        socklen_t addressLength = sizeof(connection_p->address);

        const std::lock_guard<std::mutex> lock(mutex_);
        connection_p->sockfd =
            ::accept(sockfd_, (struct sockaddr*)&connection_p->address, &addressLength);
    }

    if (connection_p->sockfd == (-1)) {

        if (errno != EAGAIN) {
            std::cout 
                << std::format(
                    "[socket] failed to accept connection, rc={} ({})",
                    errno, strerror(errno))
                << std::endl;
        }

        return errno;
    }

    return ENOERR;
}

int TcpConnection::receive(TcpMessage *msg_p) {

    if (msg_p == nullptr) {
        return ENOENT;
    }

    socklen_t addressLength = sizeof(address);
    const std::lock_guard<std::mutex> lock(rcvdMutex_);

    int size = ::recv(
        sockfd,
        msg_p->data.data(),
        msg_p->data.size(),
        MSG_WAITALL);

    if (size == (-1)) {
        msg_p->size = 0;
        return EINVAL;
    }

    msg_p->size = size;

    return ENOERR;
}

int TcpConnection::send(const std::string & data) {

    int length = 0;

    const std::lock_guard<std::mutex> lock(sendMutex_);

    length = ::send(
        sockfd,
        data.c_str(),
        data.length(),
        0);

    return length;
}

int TcpConnection::send(const TcpMessage& message) {
    return send(
        std::string(message.data.begin(),
        message.data.begin() + message.size));
}

int TcpConnection::close() {
    if (sockfd != (-1)) {
        ::close(sockfd);
        sockfd = -1;
    }
    return ENOERR;
}

std::string TcpSocket::to_string(const struct sockaddr & address) {

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