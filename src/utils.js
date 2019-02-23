const fs = require('fs')

const logger = function() {
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
  const directories = path.split('/').slice(0 , -1).join('/')
  fs.mkdirSync(directories, { recursive: true });
  fs.writeFileSync(path, content)

  return fs.statSync(path).size
}

function getRequiredFiles(context, path) {
  let requiredFiles = [];
  let files = fs.readdirSync(`${context}/${path}`)

  files.forEach(file => {
    const filePath = `${context}/${path}/${file}` // build absolute path

    if (is_dir(filePath)) {
      requiredFiles = getRequiredFiles(context, file).concat(requiredFiles)
    } else {
      /\.html$/.test(file) && (
        requiredFiles = requiredFiles.concat(`${path}/${file}`)
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

