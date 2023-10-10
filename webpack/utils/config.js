const path = require("path");

module.exports = {
  userEntry: path.resolve(__dirname, "./../../src/frontend/src/index.js"),
  adminEntry: path.resolve(
    __dirname,
    "./../../src/frontend/src/admin-index.js"
  ),
  path: path.resolve(__dirname + "./../../dist/public"),
};
