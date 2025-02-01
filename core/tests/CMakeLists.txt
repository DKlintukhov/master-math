find_package(Boost COMPONENTS unit_test_framework REQUIRED)

set(PACKAGE MasterMathTests)

add_executable(${PACKAGE} main.cpp)
target_include_directories(${PACKAGE}
    PRIVATE
        ${Boost_INCLUDE_DIR}
)

add_test(NAME ${PACKAGE} COMMAND $<TARGET_FILE:${PACKAGE}> --log_level=message)
