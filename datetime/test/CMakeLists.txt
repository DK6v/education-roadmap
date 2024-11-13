cmake_minimum_required(VERSION 3.5)

add_library (client
  Client.cpp
  Client.h
)

set(THREADS_PREFER_PTHREAD_FLAG ON)
set(CMAKE_BUILD_TYPE Debug)

find_package(Threads REQUIRED)
target_link_libraries(client PRIVATE Threads::Threads)
