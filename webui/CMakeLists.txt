option(USE_MBEDTLS ON)

set(TARGET libwebui)
set(SRC "")

add_library(${TARGET} STATIC
    ${CMAKE_CURRENT_SOURCE_DIR}/src/StartHandler.cpp
    ${SRC}
)

target_link_libraries(${TARGET}
    PUBLIC
        Threads::Threads
        Boost::json
        libcore
        webui
)
target_include_directories(${TARGET}
    PUBLIC
        ${CMAKE_SOURCE_DIR}/core/include
        ${CMAKE_CURRENT_SOURCE_DIR}
        ${CMAKE_CURRENT_SOURCE_DIR}/include
        ${WebUILibrary_SOURCE_DIR}/include
        ${Boost_INCLUDE_DIR}
)

target_precompile_headers(${TARGET} PRIVATE pch.h)


find_program(NPM_CMD npm REQUIRED)

set(FRONTEND_DIR ${CMAKE_CURRENT_SOURCE_DIR}/frontend)
set(FRONTEND_BUILD_DIR ${CMAKE_BINARY_DIR}/dist)
file(MAKE_DIRECTORY ${FRONTEND_BUILD_DIR})

# Custom command to run npm run build
add_custom_command(
    OUTPUT ${FRONTEND_BUILD_DIR}/build_stamp.txt
    COMMAND ${NPM_CMD} run build
    WORKING_DIRECTORY ${FRONTEND_DIR}
    COMMENT "Building web UI with npm..."
    VERBATIM
    DEPENDS ${FRONTEND_DIR}/package.json # Or any other files that trigger a rebuild
)

# Custom target that depends on the npm build
add_custom_target(frontend-build DEPENDS ${FRONTEND_BUILD_DIR}/build_stamp.txt)

# Copy the files from the npm build folder into the target
add_custom_command(
  TARGET ${TARGET}
  POST_BUILD # execute after ${TARGET} is built
  COMMAND ${CMAKE_COMMAND} -E copy_directory ${FRONTEND_DIR}/dist ${CMAKE_BINARY_DIR}/${CMAKE_BUILD_TYPE}
  WORKING_DIRECTORY ${FRONTEND_DIR}/dist # execute from this location
)

# Add a dependency to your main target
add_dependencies(${TARGET} frontend-build)
