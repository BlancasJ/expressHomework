const fs = require('fs');

// function to read file content
const readFile = (path, codi) => {
  return fs.promises.readFile(path, codi)
  .catch((err) => {throw err})
  .then((data) => data);
};

// function to overwrite new data
const writeFile = (path, data, codi) => {
  return fs.promises.writeFile(path, data, codi)
  .catch((err) => {throw err})
  .then((data) => data=true);
};

module.exports = {
  readFile,
  writeFile,
}
