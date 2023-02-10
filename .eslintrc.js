module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    'linebreak-style': [
      'warn',
      process.platform === 'win32' ? 'windows' : 'unix',
    ],
  },
};
