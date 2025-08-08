#pragma once

#include <cstdint>
#include <cstdlib>
#include <memory>
#include <list>
#include <mutex>
#include <condition_variable>
#include <iostream>
#include <format>

class MessageBase : public std::enable_shared_from_this<MessageBase> {
public:
    MessageBase() = default;
    virtual ~MessageBase()  {}

    static std::shared_ptr<MessageBase> allocate(uint32_t signo);
    virtual void free();

public:
    uint32_t signo = {0};

    inline static std::mutex lock_;
    inline static std::list<std::shared_ptr<MessageBase>> free_;
};

template <typename T>
class Message : public MessageBase {
public:
    T msg;

public:
    virtual ~Message() {};

    static std::shared_ptr<Message<T>> allocate(uint32_t signo);
    static void preallocate(std::size_t size);

    virtual void free() override;

private:
    Message() = default;

    inline static std::mutex lock_;
    inline static std::list<std::shared_ptr<Message<T>>> free_;
};

template <typename T>
std::shared_ptr<Message<T>> Message<T>::allocate(uint32_t signo) {
    std::shared_ptr<Message<T>> msg_p = nullptr;

    const std::lock_guard<std::mutex> lock(lock_);

    if (!free_.empty()) {
        msg_p = free_.front();
        free_.pop_front();

        msg_p->signo = signo;
    }

    return msg_p;
}

template <typename T>
void Message<T>::preallocate(std::size_t size) {
    std::shared_ptr<Message<T>> msg_p = nullptr;

    const std::lock_guard<std::mutex> lock(lock_);

    while(size--) {
        msg_p = std::shared_ptr<Message<T>>(new Message<T>());
        free_.push_back(msg_p);
    }
}

template <typename T>
void Message<T>::free() {
    const std::lock_guard<std::mutex> lock(lock_);

    auto msg_p = std::dynamic_pointer_cast<Message<T>>(this->shared_from_this());
    free_.push_back(msg_p);
}

class MessageQueue {
public:
    MessageQueue() {};
    virtual ~MessageQueue() = default;

    void send(uint32_t signo);
    std::shared_ptr<MessageBase> receive();

    template <typename T>
    void send(std::shared_ptr<Message<T>> & msg_p);

private:
    std::condition_variable rcvdCV_;

    inline static std::mutex lock_;
    std::list<std::shared_ptr<MessageBase>> queue_;
};

template <typename T>
void MessageQueue::send(std::shared_ptr<Message<T>> & msg_p) {
    {
        const std::lock_guard<std::mutex> lock(lock_);
        queue_.push_back(msg_p);
    }

    rcvdCV_.notify_all();
}
