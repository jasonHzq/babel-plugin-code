import assert from 'assert';
import path from 'path';
import fs from 'fs';
import plugin from '../src/index';
import { transform } from 'babel-core';

describe('actual builded code', () => {
  it('should strictEqual to expected code', (done) => {
    const actualPath = path.join(__dirname, 'feature/actual.js');
    const code = fs.readFileSync(actualPath).toString();

    const actual = transform(code, {
      presets: ['react'],
      plugins: [plugin],
    });
    const expectedCode = fs.readFileSync(path.join(__dirname, 'feature/expected.js')).toString();
    assert.strictEqual(actual.code.trim(), expectedCode.trim());
    done();
  });
});
