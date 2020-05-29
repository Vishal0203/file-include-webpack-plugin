const path = require('path')
const fs = require('fs')
const beautifyHtml = require('js-beautify').html;
const utils = require('./utils')

class FileIncludeWebpackPlugin {
  constructor(config) {
    // source from the context
    this.context = null
    this.source = config.source
    this.replace = config.replace
    this.destination = config.destination
    this.htmlBeautifyOptions = {
      ...utils.getHtmlBeautifyOpts(),
      ...( config.htmlBeautifyOptions || {} ),
    }

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
      const partialPathContext = path.dirname(partialFile)
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

    for (const file of files) {
      const sourcePath = path.join(this.context, file)
      const destinationPath = this.destination ? path.join(this.destination, file) : file
      const content = this.processFile(compilation, this.context, sourcePath)
      const cleanHtml = beautifyHtml(content, this.htmlBeautifyOptions);

      compilation.assets[destinationPath] = {
        source: () => cleanHtml,
        size: () => cleanHtml.length,
      }
    }

    callback()
  }

  apply(compiler) {
    this.compiler = compiler
    compiler.hooks.emit.tapAsync('FileIncludeWebpackPlugin', this.process)
  }
}

module.exports = FileIncludeWebpackPlugin
