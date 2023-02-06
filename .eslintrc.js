module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    // windows linebreaks when not in production environment
    'linebreak-style': [
      'warn',
      process.env.NODE_ENV === 'prod' ? 'unix' : 'windows',
    ],
  },
};
