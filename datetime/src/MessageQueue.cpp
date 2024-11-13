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

    auto msg_p = std::make_shared<MessageBase>();

    {
        const std::lock_guard<std::mutex> lock(lock_);

        msg_p->signo = signo;
        queue_.push_back(msg_p);
    }

    rcvdCV_.notify_all();
}

std::shared_ptr<MessageBase> MessageQueue::receive() {

    std::shared_ptr<MessageBase> msg_p = nullptr;

    std::unique_lock<std::mutex> lock(lock_);
    rcvdCV_.wait_for(lock,
        std::chrono::seconds(1),
        [&]{ return !queue_.empty(); }
    );

    if (!queue_.empty()) {
        msg_p = queue_.front();
        queue_.pop_front();
    }

    lock.unlock();

    return msg_p;
}
