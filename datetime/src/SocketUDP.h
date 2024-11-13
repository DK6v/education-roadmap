#pragma once

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

class MessageUDP {
public:
    int resolve(const std::string hostname, int port);

public:
    static constexpr std::size_t DATAGRAM_MAX_SIZE = {65535};

    struct sockaddr address;
    std::size_t size = {0};
    std::array<char, DATAGRAM_MAX_SIZE> data;
};

class SocketUDP {
public:
    SocketUDP();
    virtual ~SocketUDP();

    SocketUDP(const SocketUDP & other);
    SocketUDP & operator=(const SocketUDP & other);

    virtual int bind();
    virtual int bind(uint16_t port);

    int send(MessageUDP & message);
    int send(MessageUDP & message, std::string data);

    int receive_m(MessageUDP *msg_p);

    static std::string to_string(const struct sockaddr & address);

private:
    int sockfd_ = {-1};
    struct sockaddr_in address_ = {0};

    std::mutex recv_lock_;
    std::mutex send_lock_;
};
