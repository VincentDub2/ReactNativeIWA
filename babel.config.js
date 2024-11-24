module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      "module:metro-react-native-babel-preset", // Toujours placer ce preset en premier pour React Native
      ["babel-preset-expo", { jsxImportSource: "nativewind" }], // Expo doit venir après Metro
      "nativewind/babel",
    ],plugins: [
      'module:react-native-dotenv',
    ],
  };
};
