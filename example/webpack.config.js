const path = require('path');
const AtIncludeWebpackPlugin = require('../src')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new AtIncludeWebpackPlugin({ dir: './src/templates', test: /\.html$/ }),
  ],
};
