const path = require('path')
const fs = require('fs')
const utils = require('./utils')

class FileIncludeWebpackPlugin {
  constructor(config) {
    this.source = config.source // source from the context
    this.replace = config.replace
    this.destination = config.destination
    this.context = null

    // handlers
    this.process = this.process.bind(this)
  }

  processFile(compilation, context, file) {
    const incRegex = new RegExp(/@@include\(([^,)]*)(?:,\s*({[^@]*}\s*))?\)/, 'g');
    let content;
    try {
      content = fs.readFileSync(file, 'utf-8')
    } catch (err) {
      if (err.message.match(/no such file or directory/)) {
        throw new Error(`${file} not found`)
      } else {
        throw err
      }
    }

    // add templates to watch
    compilation.fileDependencies.add(file)

    content = content.replace(incRegex, (reg, partial, args) => {
      const partialFile = path.join(context, partial.replace(/['"]/g, ''))
      const partialPathContext = utils.getFileRoot(partialFile)
      const partialContent = this.processFile(compilation, partialPathContext, partialFile)

      return utils.substituteArgs(partialContent, args)
    })

    if (this.replace) {
      this.replace.forEach(conf => {
        content = content.replace(conf.regex, conf.to)
      })
    }

    return content
  }

  process(compilation, callback) {
    const { context } = this.compiler.options
    this.context = path.join(context, this.source)
    const files = utils.getRequiredFiles(this.context, '')

    utils.logger.info(`Working on ${files.length} .html files`)

    files.forEach(file => {
      const sourcePath = path.join(this.context, file)
      const destinationPath = this.destination ? path.join(this.destination, file) : file
      const content = this.processFile(compilation, this.context, sourcePath)

      compilation.assets[destinationPath] = {
        source: () => content,
        size: () => content.length
      }
    })

    callback()
  }

  apply(compiler) {
    this.compiler = compiler
    compiler.hooks.emit.tapAsync('FileIncludeWebpackPlugin', this.process)
  }
}

module.exports = FileIncludeWebpackPlugin
