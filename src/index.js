const path = require('path');
const fs = require('fs');
const utils = require('./utils');

class FileIncludeWebpackPlugin {
  constructor(config) {
    this.source = config.source // source from the context
    this.replace = config.replace
    this.context = null;

    // handlers
    this.process = this.process.bind(this)
  }

  processFile(compilation, file) {
    let content = fs.readFileSync(file, 'utf-8')

    content = content.replace(/@@include\('(.*)'\)/g, (toReplace, includedFile) => {
      const includedFilePath = path.join(this.context, includedFile)

      // add partials and templates to watch
      compilation.fileDependencies.add(includedFilePath)
      compilation.fileDependencies.add(file)

      return utils.getFileContent(includedFilePath)
    })

    if (this.replace) {
      this.replace.forEach(conf => {
        content = content.replace(conf.regex, conf.to)
      })
    }

    return content
  }

  process(compilation, callback) {
    const { context, output } = this.compiler.options
    this.context = path.join(context, this.source)
    const files = utils.getRequiredFiles(this.context, '')

    files.forEach(file => {
      const sourcePath = path.join(this.context, file)
      const destinationPath = path.join(output.path, file)
      const content = this.processFile(compilation, sourcePath)
      const size = utils.saveFile(destinationPath, content)

      compilation.assets[file] = {
        source: () => content,
        size: () => size,
      }
    })

    callback();
  }

  apply(compiler) {
    this.compiler = compiler
    compiler.hooks.emit.tapAsync('FileIncludeWebpackPlugin', this.process)
  }
}

module.exports = FileIncludeWebpackPlugin;
