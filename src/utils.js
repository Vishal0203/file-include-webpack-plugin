const fs = require('fs')
const modulePath = require('path')

const logger = function () {
  return {
    info: msg => console.log('\x1b[34m%s\x1b[0m', '[info] ' + msg),
    error: msg => console.error('\x1b[31m%s\x1b[0m', '[error] ' + msg)
  }
}()

function is_dir(path) {
  try {
    return fs.lstatSync(path).isDirectory()
  } catch (e) {
    return false
  }
}

function getFileContent(path, args) {
  let content = fs.readFileSync(path).toString()

  const substituteArgs = args => (
    content.replace(/@@([\w.]+)/g, (_regex, arg) => (
        arg.split('.').reduce((acc, key) => acc[key], args)
      )
    ))

  if (args) {
    try {
      content = substituteArgs(JSON.parse(args))
    } catch (e) {
      logger.error(e)
      return content
    }
  }

  return content
}

function saveFile(path, content) {
  const { sep } = modulePath;
  const directories = path.split(sep).slice(0, -1).join(sep)
  fs.mkdirSync(directories, { recursive: true })
  fs.writeFileSync(path, content)

  return fs.statSync(path).size
}

function getRequiredFiles(context, path) {
  let requiredFiles = []
  let files = fs.readdirSync(modulePath.join(context, path))

  files.forEach(file => {
    const filePath = modulePath.join(context, path, file)

    if (is_dir(filePath)) {
      requiredFiles = getRequiredFiles(context, file).concat(requiredFiles)
    } else {
      /\.html$/.test(file) && (
        requiredFiles = requiredFiles.concat(modulePath.join(path, file))
      )
    }
  })

  return requiredFiles
}

module.exports = {
  logger,
  saveFile,
  getRequiredFiles,
  getFileContent
}

