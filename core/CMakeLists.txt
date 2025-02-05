set(SRC     
    ${CMAKE_CURRENT_SOURCE_DIR}/src/Expression.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/Operand.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/Answer.cpp
)

add_executable(${PACKAGE} 
    ${CMAKE_CURRENT_SOURCE_DIR}/main.cpp 
    ${CMAKE_CURRENT_SOURCE_DIR}/src/Application.cpp 
    ${SRC}
)
target_link_libraries(${PACKAGE}
    PRIVATE
        Threads::Threads
)
target_include_directories(${PACKAGE}
    PRIVATE
        ${CMAKE_CURRENT_SOURCE_DIR}
        ${CMAKE_CURRENT_SOURCE_DIR}/include
)

target_precompile_headers(${PACKAGE} PRIVATE pch.h)

if (ENABLE_TESTS)
    add_subdirectory(tests)
endif()
