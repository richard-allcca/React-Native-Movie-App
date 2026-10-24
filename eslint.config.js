const reactNativePlugin = require('@react-native/eslint-plugin');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const jestPlugin = require('eslint-plugin-jest');

// These packages publish a meta name that does not match the prefix used in
// rule ids. Editors that namespace rules with meta.name then report the rule
// as missing on every matched file.
function alignPluginPrefix(plugin, prefix) {
  plugin.meta = {
    ...(plugin.meta ?? {}),
    name: prefix,
    namespace: prefix,
  };
}

alignPluginPrefix(reactNativePlugin, '@react-native');
alignPluginPrefix(reactHooksPlugin, 'react-hooks');
alignPluginPrefix(jestPlugin, 'jest');

const config = require('@react-native/eslint-config/flat');

for (const block of config) {
  if (
    block.rules &&
    Object.prototype.hasOwnProperty.call(
      block.rules,
      '@react-native/no-deep-imports',
    )
  ) {
    block.plugins = {
      ...block.plugins,
      '@react-native': reactNativePlugin,
    };
  }
}

module.exports = config;
