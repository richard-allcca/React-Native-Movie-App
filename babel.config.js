module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      "module:react-native-dotenv",
      {
        envName: "APP_ENV",
        moduleName: "@env",
        path: ".env",
        // blacklist: null,
        // whitelist: null,
        // safe: false,
        // allowUndefined: true
      }

    ]
    // NOTE - Si utilizas algún plugin de react-native siempre es el ultimo
  ]
};
