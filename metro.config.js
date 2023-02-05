const path = require('path');

module.exports = {
  resolver: {
    extraNodeModules: {
      utils: path.join(__dirname, '/src/utils'),
      components: path.join(__dirname, '/src/components'),
      screens: path.join(__dirname, '/src/screens'),
    },
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
