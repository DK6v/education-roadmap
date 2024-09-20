#pragma once

#include <errno.h>
#include <cstdint>
#include <array>
#include <list>
#include <memory>
#include <mutex>
#include <atomic>
#include <condition_variable>

#include <netinet/in.h>

#include "MessageQueue.h"

#ifndef ENOERR
#define ENOERR  (0)
#endif

class SocketUDP;

struct QMessageUDP {
    struct sockaddr address;
    std::size_t size = {0};
    std::array<char, 65535> data;
};

class SocketUDP {
public:
    SocketUDP();
    virtual ~SocketUDP();

    SocketUDP(const SocketUDP & other);
    SocketUDP & operator=(const SocketUDP & other);

    virtual int bind();
    virtual int bind(uint16_t port);

    int send(QMessageUDP & message ,std::string data);

    std::size_t receive_m(QMessageUDP *msg_p);

    static constexpr int INVALID = {-1};

private:
    int sockfd_ = {-1};
    struct sockaddr_in address_ = {0};

    std::mutex recv_lock_;
    std::mutex send_lock_;

    std::mutex send_pending_lock_;
    std::condition_variable send_pending_cv_;
    uint32_t sendPendingCount = {0};

    std::atomic_uint sendPendingCount_ = {0};
};
