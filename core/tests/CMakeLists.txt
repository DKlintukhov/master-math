find_package(Boost COMPONENTS unit_test_framework REQUIRED)

set(TARGET CoreTests)

add_executable(${TARGET} 
    main.cpp
    ExpressionTest.cpp
    ExpressionGeneratorTest.cpp
    ${SRC}
)
target_include_directories(${TARGET}
    PRIVATE
        ${CMAKE_SOURCE_DIR}/core
        ${CMAKE_SOURCE_DIR}/core/include
        ${Boost_INCLUDE_DIR}
)
target_link_libraries(${TARGET} 
    PRIVATE
        Boost::json
)

add_test(NAME ${TARGET} COMMAND $<TARGET_FILE:${TARGET}> --log_level=message)
