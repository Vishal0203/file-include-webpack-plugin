## File Include Webpack Plugin

A webpack plugin to include files using `@@include` syntax in html files, like `gulp-file-include` 
(passing arguments to included files not yet supported).

#### Installation
Install using:

```
npm install --save-dev file-include-webpack-plugin
```

Note: This plugin requires Webpack **4.0.0** and above. 

#### Usage

Update plugins array in your `webpack.config.js`

```javascript
// import the plugin
const FileIncludeWebpackPlugin = require('file-include-webpack-plugin')

module.exports = {
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
    )
  ]
}
```

#### Working with example
Switch to [example](example) directory and run `npm install`. Running `npm run build` post installation 
will now generate a directory `dist` with all the partials included in templates. 

