// const recursive = require("recursive-readdir");
const recursive = require('recursive-readdir-sync');

try {
  let files = recursive(`${__dirname}/../resources/`);
  files.filter((file) => {
    return (file.indexOf('.model.js') > 0);
  }).forEach((modelDefinition) => {
    // let { name, schema } = 
    require(modelDefinition);
    // db.model(name, schema);
  });

} catch (err) {
  throw err;
}