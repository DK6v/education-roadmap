#include "MessageQueue.h"


std::shared_ptr<MessageBase> MessageBase::allocate(uint32_t signo) {
    const std::lock_guard<std::mutex> lock(lock_);
    std::shared_ptr<MessageBase> msg_p = nullptr;
    if (!free_.empty()) {
        msg_p = free_.front();
        free_.pop_front();
    } else {
        msg_p = std::shared_ptr<MessageBase>(new MessageBase());
    }
    msg_p->signo = signo;
    return msg_p;
}

void MessageBase::free() {
    const std::lock_guard<std::mutex> lock(lock_);
    free_.push_back(this->shared_from_this());
}

void MessageQueue::send(uint32_t signo) {
    const std::lock_guard<std::mutex> lock(lock_);
    auto msg_p = std::make_shared<MessageBase>();

    msg_p->signo = signo;
    queue_.push_back(msg_p);
}

std::shared_ptr<MessageBase> MessageQueue::receive() {
    const std::lock_guard<std::mutex> lock(lock_);
    std::shared_ptr<MessageBase> msg_p = nullptr;

    if (!queue_.empty()) {
        msg_p = queue_.front();
        queue_.pop_front();
    }

    return msg_p;
}
