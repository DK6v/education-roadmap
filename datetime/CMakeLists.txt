cmake_minimum_required(VERSION 3.5)
project(datetime)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++20")

add_subdirectory(./src)
add_executable(datetime src src/Server.cpp)
target_link_libraries(datetime socket)

add_subdirectory(./test)
add_executable(generate test/Client.cpp)
target_link_libraries(generate client socket)

install(TARGETS datetime generate DESTINATION bin)