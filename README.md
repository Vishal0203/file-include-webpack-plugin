<div align="center">
  <img height="200" src="https://worldvectorlogo.com/logos/html-5.svg">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://cdn.worldvectorlogo.com/logos/webpack-icon.svg">
  </a>
  <h1>File Include Webpack Plugin</h1>
</div>

A webpack plugin to include files using `@@include` syntax in html files, like `gulp-file-include`. 

<div>
    <img src="https://img.shields.io/node/v/file-include-webpack-plugin.svg"/>
    <img src="https://img.shields.io/npm/v/file-include-webpack-plugin/latest.svg"/>
    <img src="https://img.shields.io/npm/dt/file-include-webpack-plugin.svg"/>
    <img src="https://img.shields.io/npm/dw/file-include-webpack-plugin.svg"/>
</div>

## Installation
```
npm install --save-dev file-include-webpack-plugin
```

Note: This plugin requires Webpack **4.0.0** and above. 

## Usage

#### Webpack Config

Update plugins array in `webpack.config.js`

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

#### How to change the output destination?

`destination` is an optional configuration, which is relative to `output.path` in webpack configuration.

```javascript
module.exports = {
  plugins: [
    new FileIncludeWebpackPlugin(
      {
        source: './src/templates',
        destination: '../html',
      },
    )
  ]
}
```

#### Template Syntax
Add templates using `@@` as shown below

```javascript
@@inlude('../partials/header.html')   //relative path to partials from parent html
```

#### Include partials inside partials
With release v1.3.5, you can now include partials inside other partials.
Use relative path w.r.t. including parent.  

#### Passing arguments to partials
`file-include-webpack-plugin` allows passing **substitutable** arguments as a key-value JSON to the included files.

```javascript
@@inlude('../partials/header.html', {
  "arg1": "value1",
  "arg2": "value2",
  "arg3": {
    "arg3a": "value3a",
    "arg3b": "value3b",
  },
  ...
})
```

Access the arguments in partials as `@@arg1`, `@@arg2`, `@@arg3.arg3a`, and so on. Refer [example](example) for complete reference.

Note:
- Currently, only supports value substitution. Passing an `array` or an `object` as value, may not give intended output. 
- Please raise an [issue](https://github.com/Vishal0203/file-include-webpack-plugin/issues) for any new requirements.  


## Working with example
Switch to [example](example) directory and run `npm install`. Running `npm run build` post installation 
will now generate a directory `dist` with all the partials included in templates.

Run `npm run watch` to run webpack in watch mode, to continue developing and re-compiling webpack on
every change. 

Or, run `npm run dev` to launch webpack dev server. 