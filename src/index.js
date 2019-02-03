const path = require('path');
const fs = require('fs');
const utils = require('./utils');

class FileIncludeWebpackPlugin {
  constructor(config) {
    this.source = config.dir // source from the context
    this.regex = config.test
    this.replace = config.replace
    this.context = null;

    // handlers
    this.process = this.process.bind(this)
  }

  processFile(file) {
    let absPath = path.join(this.context, file)
    let content = fs.readFileSync(absPath, 'utf-8')

    content = content.replace(/@@include\('(.*)'\)/g, (toReplace, includedFile) => {
      const includedFilePath = path.join(this.context, includedFile)
      return utils.getFileContent(includedFilePath)
    })

    if (this.replace) {
      this.replace.forEach(conf => {
        content = content.replace(conf.from, conf.to)
      })
    }

    return content
  }

  process(compilation, callback) {
    const { context, output } = this.compiler.options
    this.context = path.join(context, this.source)
    const files = utils.getRequiredFiles(this.context, '', this.regex)

    files.forEach(file => {
      const outputPath = path.join(output.path, file)
      const content = this.processFile(file)
      const size = utils.saveFile(outputPath, content)

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
