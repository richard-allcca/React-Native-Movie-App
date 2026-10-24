/**
 * Ninja 1.10, the binary shipped with the Android SDK CMake, refuses object
 * paths longer than 260 characters. react-native-gesture-handler compiles
 * shared/shadowNodes from outside its android folder, so CMake embeds this
 * checkout's absolute path in the object name.
 *
 * Copy those sources under android/build and compile the copies. Object names
 * stay relative to the library. Re-applied after npm install because the
 * change lives in node_modules.
 */
const fs = require('fs');
const path = require('path');

const cmakePath = path.join(
  __dirname,
  '..',
  'node_modules',
  'react-native-gesture-handler',
  'android',
  'CMakeLists.txt',
);

const marker = 'moviesApp: short object paths';

const sourceBlock = `file(GLOB_RECURSE rn_gesture_handler_SRCS CONFIGURE_DEPENDS ../shared/shadowNodes/*.cpp)
file(GLOB_RECURSE rn_gesture_handler_codegen_SRCS CONFIGURE_DEPENDS ./build/generated/source/codegen/jni/*.cpp)`;

const patchedBlock = `# ${marker}
set(_shadow_src_dir "\${CMAKE_CURRENT_SOURCE_DIR}/../shared/shadowNodes")
set(_shadow_dst_dir "\${CMAKE_CURRENT_SOURCE_DIR}/build/short-shadow")
file(COPY "\${_shadow_src_dir}/" DESTINATION "\${_shadow_dst_dir}")
file(GLOB_RECURSE rn_gesture_handler_SRCS CONFIGURE_DEPENDS "\${_shadow_dst_dir}/*.cpp")
file(GLOB_RECURSE rn_gesture_handler_codegen_SRCS CONFIGURE_DEPENDS ./build/generated/source/codegen/jni/*.cpp)`;

const sourceInclude =
  'target_include_directories(react_codegen_rngesturehandler_codegen PUBLIC ../shared/shadowNodes)';

const patchedInclude = `target_include_directories(react_codegen_rngesturehandler_codegen PUBLIC "\${_shadow_dst_dir}")
target_include_directories(react_codegen_rngesturehandler_codegen PUBLIC ../shared/shadowNodes)`;

if (!fs.existsSync(cmakePath)) {
  process.exit(0);
}

const original = fs.readFileSync(cmakePath, 'utf8');
if (original.includes(marker)) {
  process.exit(0);
}

if (!original.includes(sourceBlock) || !original.includes(sourceInclude)) {
  console.warn(
    'shorten-gesture-handler-objects: CMakeLists.txt no coincide; no se modificó.',
  );
  process.exit(0);
}

const patched = original
  .replace(sourceBlock, patchedBlock)
  .replace(sourceInclude, patchedInclude);

fs.writeFileSync(cmakePath, patched);
