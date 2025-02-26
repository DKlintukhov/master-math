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
        ${CMAKE_BINARY_DIR}/core/${CMAKE_BUILD_TYPE}/libmastermath.lib
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

target_precompile_headers(${TARGET} PRIVATE pch.h)
