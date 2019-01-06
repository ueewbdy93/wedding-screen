import L from 'lodash';
import path from 'path';

export default function createResolveAlias(modules) {
  return L.reduce(
    modules,
    (result, module) => {
      result[module] = path.resolve(__dirname, './../../node_modules', module);
      return result;
    }, {});
}
