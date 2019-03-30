const path = require('path');
const FileIncludeWebpackPlugin = require('../src/index')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new FileIncludeWebpackPlugin({
      source: './src/templates',
      replace: [{
        regex: /\[\[FILE_VERSION]]/g,
        to: 'v=1.0.0',
      }],
    }),
  ],
};
