cmake_minimum_required(VERSION 3.13)

if (PROJECT_SOURCE_DIR STREQUAL PROJECT_BINARY_DIR)
    message(FATAL_ERROR "In-source builds are not allowed. You should create separate directory for build files.")
endif()

set(VERSION 0.0.1)
set(PACKAGE MasterMath)

set(PACKAGE_BUGREPORT "https://github.com/DKlintukhov/MasterMath/issues")
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_C_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_C_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)
set(CMAKE_C_EXTENSIONS OFF)

project(
    ${PACKAGE}
    VERSION ${VERSION}
    DESCRIPTION "MasterMath is an intuitive platform designed for math educators to effortlessly create, customize, and assign timed exercises, quizzes, and problem sets."
    LANGUAGES C CXX
)

option(ENABLE_TESTS "Enable tests" ON)

find_package(Threads REQUIRED)

set(SRC     
    ${CMAKE_SOURCE_DIR}/src/Expression.cpp
    ${CMAKE_SOURCE_DIR}/src/Operand.cpp
    ${CMAKE_SOURCE_DIR}/src/Answer.cpp
)

add_executable(${PACKAGE} ${CMAKE_SOURCE_DIR}/main.cpp ${SRC})
target_link_libraries(${PACKAGE}
    PRIVATE
        Threads::Threads
)
target_include_directories(${PACKAGE}
    PRIVATE
        ${CMAKE_SOURCE_DIR}
        ${CMAKE_SOURCE_DIR}/include
)

target_precompile_headers(${PACKAGE} PRIVATE pch.h)

if (ENABLE_TESTS)
    enable_testing()
    add_subdirectory(tests)
endif()

if(CMAKE_BUILD_TYPE STREQUAL "Debug")
    if(MSVC)
        add_compile_options(/MTd /MP /utf-8 /W4 /WX)
    else()
        add_compile_options(-Wall -Wextra -pedantic -Werror)
    endif()
elseif(CMAKE_BUILD_TYPE STREQUAL "Release")
    if(CMAKE_CXX_COMPILER_ID STREQUAL "MSVC")
        add_compile_options(/MT /MP /W0 /utf-8)
    else()
        add_compile_options(-fno-rtti -fstack-protector)
    endif()
endif()
