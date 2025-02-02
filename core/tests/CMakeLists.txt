find_package(Boost COMPONENTS unit_test_framework REQUIRED)

set(PACKAGE MasterMathTests)

add_executable(${PACKAGE} 
    main.cpp
    ${CMAKE_SOURCE_DIR}/src/Expression.cpp
    ${CMAKE_SOURCE_DIR}/src/Operand.cpp
)
target_include_directories(${PACKAGE}
    PRIVATE
        ${CMAKE_SOURCE_DIR}
        ${CMAKE_SOURCE_DIR}/include
        ${Boost_INCLUDE_DIR}
)

add_test(NAME ${PACKAGE} COMMAND $<TARGET_FILE:${PACKAGE}> --log_level=message)
