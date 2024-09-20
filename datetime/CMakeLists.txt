cmake_minimum_required(VERSION 3.14)
project(datetime)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

#include the subdirectory containing our libs
add_subdirectory (src)
include_directories (src)

#indicate the entry point for the executable
add_executable (datetime src src/Server.cpp)

# Indicate which libraries to include during the link process.
target_link_libraries (datetime server)

install (TARGETS datetime DESTINATION bin)