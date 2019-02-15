<div align="center">
  <img height="200" src="https://worldvectorlogo.com/logos/html-5.svg">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://cdn.worldvectorlogo.com/logos/webpack-icon.svg">
  </a>
  <h1>File Include Webpack Plugin</h1>
</div>

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
        source: './src/templates', // relative path to your templates
        replace: [{
          regex: /\[\[FILE_VERSION]]/, // additional things to replace
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

Run `npm run watch` to run webpack in watch mode, to continue developing and re-compiling webpack on
every change. 

