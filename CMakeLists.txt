cmake_minimum_required(VERSION 3.25.1)

if (PROJECT_SOURCE_DIR STREQUAL PROJECT_BINARY_DIR)
    message(FATAL_ERROR "In-source builds are not allowed. You should create separate directory for build files.")
endif()

set(TARGET MasterMath)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_C_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_C_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)
set(CMAKE_C_EXTENSIONS OFF)
set(CMAKE_COMPILE_WARNING_AS_ERROR ON)

if(NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE Debug)
endif()

if(NOT MSVC)
    set(OUTPUT_DIR ${CMAKE_BINARY_DIR}/)
else()
    set(OUTPUT_DIR ${CMAKE_BINARY_DIR}/${CMAKE_BUILD_TYPE})
endif()

project(
    ${TARGET}
    VERSION 1.1.0
    HOMEPAGE_URL "https://github.com/DKlintukhov/master-math"
    DESCRIPTION "MasterMath is an intuitive platform designed for math educators to effortlessly create, customize, and assign timed exercises, quizzes, and problem sets."
    LANGUAGES C CXX
)

set(PACKAGE_VERSION "${PROJECT_VERSION}")
set(PACKAGE_NAME "${PROJECT_NAME}")
set(PACKAGE_HOMEPAGE_URL "${PROJECT_HOMEPAGE_URL}")
set(PACKAGE_BUGREPORT_URL "${PROJECT_HOMEPAGE_URL}/issues")
set(PACKAGE_RELEASES_URL "${PROJECT_HOMEPAGE_URL}/releases")

option(ENABLE_TESTS "Enable tests" OFF)
option(USE_MBEDTLS ON)
if(ENABLE_TESTS)
    enable_testing()
endif()

if (NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE "Debug")
endif()

if(CMAKE_BUILD_TYPE STREQUAL "Debug")
    set(DEBUG 1)
    add_definitions(-DWEBUI_LOG)
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

add_subdirectory(core)

set_target_properties(${TARGET} PROPERTIES RUNTIME_OUTPUT_DIRECTORY ${OUTPUT_DIR})

set(FRONTEND_DIR ${CMAKE_CURRENT_SOURCE_DIR}/frontend)
set(FRONTEND_BUILD_DIR ${CMAKE_BINARY_DIR}/dist)
file(MAKE_DIRECTORY ${FRONTEND_BUILD_DIR})

add_custom_target(install-frontend-deps
    COMMAND ${NPM_CMD} install
    WORKING_DIRECTORY ${FRONTEND_DIR}
    COMMENT "Installing frontend dependencies..."
    VERBATIM
)

add_custom_target(build-frontend
    COMMAND ${NPM_CMD} run build
    WORKING_DIRECTORY ${FRONTEND_DIR}
    COMMENT "Building frontend..."
    VERBATIM
)

# Copy the files from the npm build folder into the target
add_custom_command(
  TARGET build-frontend
  COMMAND ${CMAKE_COMMAND} -E copy_directory ${FRONTEND_DIR}/dist ${CMAKE_BINARY_DIR}/${CMAKE_BUILD_TYPE}
  WORKING_DIRECTORY ${FRONTEND_DIR}/dist
)
