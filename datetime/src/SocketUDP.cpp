#include <cstdlib>
#include <cstring>
#include <unistd.h>
#include <iostream>
#include <mutex>

#include <fcntl.h>
#include <sys/socket.h>
#include <netinet/in.h>

#include "SocketUDP.h"

using namespace std;

SocketUDP::SocketUDP() {
    if ((sockfd_ = socket(AF_INET, SOCK_DGRAM, 0)) == INVALID) {
        std::cout << "[socket] failed to create" << std::endl;
    } else {
        struct timeval timeout = {
            .tv_sec = 0,
            .tv_usec = 1,
        };
        
        if (setsockopt(sockfd_, SOL_SOCKET, SO_RCVTIMEO, &timeout, sizeof(timeout)) == -1) {
            std::cerr << "setsockopt error" << std::endl;
        }

        int send_buf_size = 1024 * 1024 * 2 /* MB */;
        if (setsockopt(sockfd_, SOL_SOCKET, SO_SNDBUF, &send_buf_size, sizeof(int)) == -1) {
            std::cerr << "setsockopt error" << std::endl;
        }

        int recv_buf_size = 1024 * 1024 * 2 /* MB */;
        if (setsockopt(sockfd_, SOL_SOCKET, SO_RCVBUF, &recv_buf_size, sizeof(int)) == -1) {
            std::cerr << "setsockopt error" << std::endl;
        }

        std::cout << "[socket] created succesfully" << std::endl;
    }}

SocketUDP::~SocketUDP() {
    if (sockfd_ != INVALID) {
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

    int rc = INVALID;

    std::memset(&address_, 0, sizeof(address_));
    address_.sin_family = AF_INET; // IPv4 
    address_.sin_addr.s_addr = INADDR_ANY; 
    address_.sin_port = htons(port); 

    rc = ::bind(sockfd_, (const struct sockaddr *)&address_, sizeof(address_));
    if (rc == INVALID) {
        std::cout << "[socket] failed to bind" << std::endl;
        return errno;
    }

    std::cout << "[socket] bound port " << port << " succesfully" << std::endl;
    return ENOERR;
}

std::size_t SocketUDP::receive_m(QMessageUDP *msg_p) {

    static int count = 0;

    {
        std::unique_lock<std::mutex> send_pending_lock(send_pending_lock_);
        send_pending_cv_.wait(send_pending_lock, [&]{ return (sendPendingCount == 0); });
        send_pending_lock.unlock();
    }

    if (msg_p != nullptr) {

        const std::lock_guard<std::mutex> lock(recv_lock_);
        socklen_t addressLength = sizeof(msg_p->address);

        msg_p->size = ::recvfrom(
            sockfd_,
            msg_p->data.data(),
            msg_p->data.size(),
            MSG_WAITALL, /* flags */
            &msg_p->address,
            &addressLength);
    }

    if (msg_p->size == (-1)) {
        msg_p->size = 0;
    }

    return msg_p->size;
}

int SocketUDP::send(QMessageUDP & message ,std::string data) {

    int length = 0;

    {
        const std::lock_guard<std::mutex> lock(send_pending_lock_);
        ++sendPendingCount;
    }

    {
        const std::lock_guard<std::mutex> lock(send_lock_);
        length = sendto(
            sockfd_,
            data.c_str(),
            data.length(),  
            MSG_CONFIRM,
            &message.address, 
            sizeof(message.address));
    }

    {
        const std::lock_guard<std::mutex> lock(send_pending_lock_);
        --sendPendingCount;
    }

    send_pending_cv_.notify_all();

    return length;
}
