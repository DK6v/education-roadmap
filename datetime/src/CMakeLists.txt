add_library (socket 
  MessageQueue.h
  MessageQueue.cpp
  SocketUDP.h
  SocketUDP.cpp)

set(THREADS_PREFER_PTHREAD_FLAG ON)
set(CMAKE_BUILD_TYPE Debug)

find_package(Threads REQUIRED)
target_link_libraries(socket PRIVATE Threads::Threads)
