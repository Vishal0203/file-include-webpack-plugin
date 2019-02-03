const path = require('path');
const fs = require('fs');
const utils = require('./utils');

class AtIncludeWebpackPlugin {
  constructor(config) {
    this.source = config.dir // source from the context
    this.regex = config.test
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
        size: () => size
      }
    })

    callback();
  }

  apply(compiler) {
    this.compiler = compiler
    compiler.hooks.emit.tapAsync('AtIncludeWebpackPlugin', this.process)
  }
}

module.exports = AtIncludeWebpackPlugin;
