find_package(Boost COMPONENTS unit_test_framework REQUIRED)

set(TARGET_TESTS CoreTests)

add_executable(${TARGET_TESTS} 
    main.cpp
    ExpressionGeneratorTest.cpp
    ${SRC}
)
target_include_directories(${TARGET_TESTS} PRIVATE ${INCLUDES})
target_link_libraries(${TARGET_TESTS} PRIVATE ${LIBS})
target_precompile_headers(${TARGET_TESTS} REUSE_FROM ${TARGET})

add_test(NAME ${TARGET_TESTS} COMMAND $<TARGET_FILE:${TARGET_TESTS}> --log_level=message)
