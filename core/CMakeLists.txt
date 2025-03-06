set(SRC     
    ${CMAKE_CURRENT_SOURCE_DIR}/src/Expression.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/ExpressionGenerator.cpp
)

set(TARGET libcore)

add_library(${TARGET} STATIC ${SRC})
target_link_libraries(${TARGET}
    PRIVATE
        Threads::Threads
        Boost::json
)
target_include_directories(${TARGET}
    PRIVATE
        ${CMAKE_CURRENT_SOURCE_DIR}
        ${CMAKE_CURRENT_SOURCE_DIR}/include
        ${Boost_INCLUDE_DIR}
)

target_precompile_headers(${TARGET} PRIVATE pch.h)

if (ENABLE_TESTS)
    add_subdirectory(tests)
endif()
