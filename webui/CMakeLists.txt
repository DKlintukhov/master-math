option(USE_MBEDTLS ON)

set(SRC "")

add_executable(webui
    ${CMAKE_CURRENT_SOURCE_DIR}/main.cpp 
    ${SRC}
)
target_link_libraries(webui
    PRIVATE
        Threads::Threads
        ${libwebui_BINARY_DIR}/Debug/webui-2.lib
)
target_include_directories(webui
    PRIVATE
        ${CMAKE_CURRENT_SOURCE_DIR}
        ${CMAKE_CURRENT_SOURCE_DIR}/include
        ${libwebui_SOURCE_DIR}/include
)

target_precompile_headers(webui PRIVATE pch.h)
