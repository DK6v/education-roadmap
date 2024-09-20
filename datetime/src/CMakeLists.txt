add_library (server 
  Server.cpp
  MessageQueue.h
  MessageQueue.cpp
  SocketUDP.h
  SocketUDP.cpp)

set(THREADS_PREFER_PTHREAD_FLAG ON)
set(CMAKE_BUILD_TYPE Debug)

find_package(Threads REQUIRED)
target_link_libraries(server PRIVATE Threads::Threads)

install (TARGETS server DESTINATION bin)
install (FILES SocketUDP.h DESTINATION include)
