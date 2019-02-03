const fs = require('fs')

function is_dir(path) {
  try {
    return fs.lstatSync(path).isDirectory()
  } catch (e) {
    return false
  }
}

function getFileContent(path) {
  return fs.readFileSync(path).toString()
}

function saveFile(path, content) {
  const directories = path.split('/').slice(0 , -1).join('/')
  fs.mkdirSync(directories, { recursive: true });
  fs.writeFileSync(path, content)

  return fs.statSync(path).size
}

function getRequiredFiles(context, path, regex) {
  let requiredFiles = [];
  let files = fs.readdirSync(`${context}/${path}`)

  files.forEach(file => {
    const filePath = `${context}/${path}/${file}` // build absolute path

    if (is_dir(filePath)) {
      requiredFiles = getRequiredFiles(context, file, regex).concat(requiredFiles)
    } else {
      regex.test(file) && (
        requiredFiles = requiredFiles.concat(`${path}/${file}`)
      )
    }
  })

  return requiredFiles
}

module.exports = {
  saveFile,
  getRequiredFiles,
  getFileContent
}

