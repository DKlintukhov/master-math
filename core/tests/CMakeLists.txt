find_package(Boost COMPONENTS unit_test_framework REQUIRED)

set(PACKAGE MasterMathTests)

add_executable(${PACKAGE} 
    SimpleExpressionTests.cpp
    ${SRC}
)
target_include_directories(${PACKAGE}
    PRIVATE
        ${CMAKE_SOURCE_DIR}/core
        ${CMAKE_SOURCE_DIR}/core/include
        ${Boost_INCLUDE_DIR}
)

add_test(NAME ${PACKAGE} COMMAND $<TARGET_FILE:${PACKAGE}> --log_level=message)
