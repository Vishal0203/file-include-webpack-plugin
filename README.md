## File Include Webpack Plugin

A webpack plugin to include files using `@@include` syntax in html files, like `gulp-file-include` 
(passing arguments to included files not yet supported).

#### Installation

Install plugin using:

```
npm install --save-dev file-include-webpack-plugin
```

#### Usage

Update plugins array in your `webpack.config.js`

```javascript
plugins: [
  new FileIncludeWebpackPlugin(
    {
      dir: './src/templates', // relative path to your templates
      test: /\.html$/, // files to look at
      replace: [{
        from: '[[FILE_VERSION]]', // additional things to replace
        to: 'v=1.0.0',
      }],
    },
  ),
]
```
