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
    ${CMAKE_CURRENT_SOURCE_DIR}/src/User.cpp
)

set(INCLUDES 
    ${CMAKE_CURRENT_SOURCE_DIR}
    ${CMAKE_CURRENT_SOURCE_DIR}/include
    ${Boost_INCLUDE_DIR}
    ${muparser_DIR}/include
    ${WebUILibrary_SOURCE_DIR}/include
)

if (WIN32)
    set(WEBUI_LIB ${CMAKE_BINARY_DIR}/core/webui/src/webui-build/${CMAKE_BUILD_TYPE}/webui-2.lib)
    set(LIBS ${LIBS} msvcrt)
    set(CMAKE_ARGS ${CMAKE_ARGS}
        -DCMAKE_TOOLCHAIN_FILE=${CMAKE_TOOLCHAIN_FILE}
        -DCMAKE_BUILD_TYPE=${CMAKE_BUILD_TYPE}
        -DCMAKE_MSVC_RUNTIME_LIBRARY=${CMAKE_MSVC_RUNTIME_LIBRARY}
    )
else()
    set(WEBUI_LIB ${CMAKE_BINARY_DIR}/core/webui/src/webui-build/webui-2.a)
    set(CMAKE_ARGS ${CMAKE_ARGS} -DCMAKE_BUILD_TYPE=${CMAKE_BUILD_TYPE})
endif()
set(INCLUDES ${INCLUDES} ${CMAKE_BINARY_DIR}/core/webui/src/webui/include)

include(ExternalProject)
set(FETCHCONTENT_QUIET OFF)

ExternalProject_Add(
    webui
    PREFIX           webui
    GIT_REPOSITORY   https://github.com/webui-dev/webui.git
    GIT_TAG          2.5.0-beta.3
    GIT_SHALLOW      TRUE
    TLS_VERIFY       TRUE
    BUILD_BYPRODUCTS ${WEBUI_LIB}
    CMAKE_ARGS		 ${CMAKE_ARGS}
    INSTALL_COMMAND  ""
    LOG_DOWNLOAD     ON
    LOG_UPDATE       ON
    LOG_CONFIGURE    ON
    LOG_BUILD        ON
    LOG_INSTALL      ON
)

set(LIBS ${LIBS}
    Threads::Threads
    Boost::json
    Boost::nowide
    muparser::muparser
    ${WEBUI_LIB}
)

add_executable(${TARGET} main.cpp ${SRC})
add_dependencies(${TARGET} webui)

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
