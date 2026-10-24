const reactNativePlugin = require('@react-native/eslint-plugin');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const jestPlugin = require('eslint-plugin-jest');

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

module.exports = {
  root: true,
  extends: '@react-native',
  overrides: [
    {
      files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
      plugins: [
        'eslint-comments',
        'react',
        'react-hooks',
        'react-native',
        '@react-native',
        'jest',
        'ft-flow',
        '@typescript-eslint',
      ],
      rules: {
        '@react-native/no-deep-imports': 1,
      },
    },
  ],
};
