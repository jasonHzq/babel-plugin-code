import Module from 'module';
import * as babylon from "babylon";
import traverse from "babel-traverse";
import pluginGenerator from 'cherry-pick-babel-plugin-generator';
import path from 'path';
import fs from 'fs';
import * as t from 'babel-types';

const pkgName = '@ali/op-ebase';

const _module = new Module();

const pkgPath = path.dirname(Module._resolveFilename(pkgName, {
  ..._module,
  paths: Module._nodeModulePaths(process.cwd()),
}));

const code = fs.readFileSync(pkgPath + '/index.js', 'utf-8');

const ast = babylon.parse(code, {
  sourceType: 'module',
  presets: ['es2015'],
});

const pkgMap = {};
const exportPkgMap = {};

traverse(ast, {
  ImportDeclaration(path) {
    const { node } = path;
    const { source, specifiers } = node;
    const modulePath = source.value;
    const moduleName = modulePath.indexOf('./') === 0 ?
      pkgName + '/src' + modulePath.slice(1) :
      modulePath;
    
    specifiers.forEach(spec => {
      const { local, imported } = spec;

      if (t.isImportSpecifier(spec)) {
        const localName = local.name;
        const importName = imported.name;

        pkgMap[localName] = [moduleName, importName];
      } else if (t.isImportDefaultSpecifier(spec)) {
        const localName = local.name;

        pkgMap[localName] = [moduleName];
      }
    });
  },

  AssignmentExpression(path) {
    const { node } = path;
    const { left, right } = node;

    if (t.isMemberExpression(left) && left.object.name === 'module') {
      const { properties } = right;

      properties.forEach(prop => {
        const { key, value } = prop;
        const keyName = key.name;
        const valueName = value.name;
        
        if (pkgMap[valueName]) {
          exportPkgMap[keyName] = pkgMap[valueName];
        }
      });
    }
  }
});

export default pluginGenerator({[pkgName]: exportPkgMap});


