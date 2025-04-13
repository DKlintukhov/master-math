find_package(Threads REQUIRED)
find_package(Boost COMPONENTS json nowide REQUIRED)
find_package(muparser REQUIRED)
find_program(NPM_CMD npm REQUIRED)

set(SRC 
    ${CMAKE_CURRENT_SOURCE_DIR}/src/Exercise.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/Utf8.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/ExpressionGenerator.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/GenerateExpressionsHandler.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/SolveExpressionsHandler.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/SaveExerciseHandler.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/LoadExercisesHandler.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/DeleteExerciseHandler.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/GetAppInfoHandler.cpp
)

set(INCLUDES 
    ${CMAKE_CURRENT_SOURCE_DIR}
    ${CMAKE_CURRENT_SOURCE_DIR}/include
    ${Boost_INCLUDE_DIR}
    ${muparser_DIR}/include
    ${WebUILibrary_SOURCE_DIR}/include
)

include(FetchContent)
set(FETCHCONTENT_QUIET OFF)

FetchContent_Declare(
    webui
    GIT_REPOSITORY https://github.com/webui-dev/webui.git
    GIT_TAG        main
    TLS_VERIFY 	   TRUE
    GIT_SHALLOW    TRUE
    GIT_PROGRESS   TRUE
)
FetchContent_MakeAvailable(webui)

set(LIBS
    Threads::Threads
    Boost::json
    Boost::nowide
    muparser::muparser
    webui
)

add_executable(${TARGET} main.cpp ${SRC})
target_link_libraries(${TARGET} PRIVATE ${LIBS})
target_include_directories(${TARGET} PRIVATE ${CMAKE_BINARY_DIR} ${INCLUDES})
target_precompile_headers(${TARGET} PRIVATE pch.h)

if (WIN32)
    add_definitions(-DNOMINMAX)
    # hide the console in the Release build
    if (MSVC AND NOT CMAKE_BUILD_TYPE STREQUAL "Debug")
        set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} /SUBSYSTEM:WINDOWS /ENTRY:mainCRTStartup")
    endif()

    target_compile_options(${TARGET} PRIVATE /DWIN32 /D_WINDOWS)
    target_sources(${TARGET} PRIVATE ${CMAKE_SOURCE_DIR}/windows/resource.rc)
endif()

configure_file(${CMAKE_CURRENT_SOURCE_DIR}/config.h.in ${CMAKE_BINARY_DIR}/config.h)

if (ENABLE_TESTS)
    add_subdirectory(tests)
endif()
