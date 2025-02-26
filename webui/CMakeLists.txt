option(USE_MBEDTLS ON)

set(SRC "")

add_executable(${TARGET}
    ${CMAKE_CURRENT_SOURCE_DIR}/main.cpp 
    ${SRC}
)

target_link_libraries(${TARGET}
    PRIVATE
        Threads::Threads
        Boost::json
        libmastermath
        ${WebUILibrary_BINARY_DIR}/${CMAKE_BUILD_TYPE}/webui-2.lib
)
target_include_directories(${TARGET}
    PRIVATE
        ${CMAKE_SOURCE_DIR}/core/include
        ${CMAKE_CURRENT_SOURCE_DIR}
        ${CMAKE_CURRENT_SOURCE_DIR}/include
        ${WebUILibrary_SOURCE_DIR}/include
        ${Boost_INCLUDE_DIR}
)

if (WIN32)
    # hide the console in the Release build
    if (MSVC AND NOT CMAKE_BUILD_TYPE STREQUAL "Debug")
        set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} /SUBSYSTEM:WINDOWS /ENTRY:mainCRTStartup")
    endif()
endif()

target_precompile_headers(${TARGET} PRIVATE pch.h)
