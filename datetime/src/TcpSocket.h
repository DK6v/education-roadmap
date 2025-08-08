#pragma once

#include <cstdint>
#include <array>
#include <list>
#include <memory>
#include <mutex>
#include <atomic>
#include <condition_variable>

#include <netinet/in.h>

// #include "MessageQueue.h"

#ifndef ENOERR
#define ENOERR  (0)
#endif

namespace TCP {

static const uint16_t ANY = 0;

class TcpMessage {
public:
    static constexpr std::size_t MAX_SIZE = {65535};

    std::size_t size = {0};
    std::array<char, MAX_SIZE> data;
};

class TcpConnection {
public:
    ~TcpConnection() { close(); }

    int send(const std::string& data);
    int send(const TcpMessage& message);

    int receive(TcpMessage* message_p);

    int close();

public:
    int sockfd = {-1};
    struct sockaddr address;

    std::mutex sendMutex_;
    std::mutex rcvdMutex_;
};

class TcpSocket {
public:
    TcpSocket();
    virtual ~TcpSocket();

    TcpSocket(const TcpSocket & other);
    TcpSocket & operator=(const TcpSocket & other);

    virtual int listen(uint16_t port, uint32_t maxConn);

    int accept(TcpConnection* connection_p);

    static std::string to_string(const struct sockaddr & address);

private:
    int sockfd_ = {-1};
    struct sockaddr_in address_ = {0};

    std::mutex mutex_;
};

};