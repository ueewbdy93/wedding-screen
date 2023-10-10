const path = require("path");

/**
 * @param {string[]} modules 
 */
module.exports = function createResolveAlias(modules) {
  return modules.reduce(
    /**
     * @param {{[key:string]: string}} result 
     * @param {string} module 
     */
    (result, module) => {
      result[module] = path.resolve(__dirname, "./../../node_modules", module);
      return result;
    }, {});
};
