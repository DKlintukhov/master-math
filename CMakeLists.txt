cmake_minimum_required(VERSION 3.25)

if (PROJECT_SOURCE_DIR STREQUAL PROJECT_BINARY_DIR)
    message(FATAL_ERROR "In-source builds are not allowed. You should create separate directory for build files.")
endif()

set(VERSION 0.1.0)
set(TARGET MasterMath-v${VERSION})

set(PACKAGE_BUGREPORT "https://github.com/DKlintukhov/MasterMath/issues")
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_C_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_C_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)
set(CMAKE_C_EXTENSIONS OFF)

project(
    ${TARGET}
    VERSION ${VERSION}
    DESCRIPTION "MasterMath is an intuitive platform designed for math educators to effortlessly create, customize, and assign timed exercises, quizzes, and problem sets."
    LANGUAGES C CXX
)

option(ENABLE_TESTS "Enable tests" ON)
option(USE_MBEDTLS ON)
if (ENABLE_TESTS)
    enable_testing()
endif()

if(NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE Debug)
endif()

if(CMAKE_BUILD_TYPE STREQUAL "Debug")
    add_definitions(-DWEBUI_LOG)
    set(CMAKE_COMPILE_WARNING_AS_ERROR ON)
    if(MSVC)
        set(CMAKE_MSVC_RUNTIME_LIBRARY MultiThreadedDebug)
    endif()
elseif(CMAKE_BUILD_TYPE STREQUAL "Release")
    if(CMAKE_CXX_COMPILER_ID STREQUAL "MSVC")
        set(CMAKE_MSVC_RUNTIME_LIBRARY MultiThreaded)
    else()
        add_compile_options(-fno-rtti -fstack-protector)
    endif()
endif()

find_package(Threads REQUIRED)
find_package(Boost COMPONENTS json REQUIRED)

include(FetchContent)
set(FETCHCONTENT_QUIET FALSE)

FetchContent_Declare(
    libwebui
    GIT_REPOSITORY https://github.com/webui-dev/webui.git
    GIT_TAG        main
    TLS_VERIFY 	   TRUE
    GIT_SHALLOW    TRUE
    GIT_PROGRESS   TRUE
)
FetchContent_MakeAvailable(libwebui)

add_subdirectory(core)
add_subdirectory(webui)

add_executable(${TARGET} main.cpp)
target_link_libraries(${TARGET} 
    PRIVATE
        libwebui
)
target_include_directories(${TARGET} 
    PRIVATE
        ${CMAKE_SOURCE_DIR}/webui/include
)

if (WIN32)
    # hide the console in the Release build
    if (MSVC AND NOT CMAKE_BUILD_TYPE STREQUAL "Debug")
        set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} /SUBSYSTEM:WINDOWS /ENTRY:mainCRTStartup")
    endif()

    target_compile_options(${TARGET} PRIVATE /DWIN32 /D_WINDOWS)
    target_sources(${TARGET} PRIVATE ${CMAKE_SOURCE_DIR}/windows/resource.rc)
endif()
