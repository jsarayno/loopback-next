// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {ApplicationConfig} from '@loopback/core';
import {juggler, RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  expect,
  givenHttpServerConfig,
  TestSandbox,
  toJSON,
} from '@loopback/testlab';
import {resolve} from 'path';
import {BootMixin, ModelApiBooter} from '../..';
import {Product} from '../fixtures/product.model';
import {
  buildCalls,
  StubModelApiBuilderComponent,
} from '../fixtures/stub-model-api-builder';

describe('model API booter acceptance tests', () => {
  let app: BooterApp;
  const SANDBOX_PATH = resolve(__dirname, '../../.sandbox');
  const sandbox = new TestSandbox(SANDBOX_PATH);

  beforeEach('reset sandbox', () => sandbox.reset());
  beforeEach(givenAppWithDataSource);

  afterEach(stopApp);

  it('uses the correct model API builder', async () => {
    await sandbox.copyFile(
      resolve(__dirname, '../fixtures/product.model.js'),
      'models/product.model.js',
    );

    await sandbox.writeTextFile(
      'model-endpoints/product.rest-config.js',
      `
const {Product} = require('../models/product.model');
module.exports = {
  model: Product,
  pattern: 'stub',
  dataSource: 'db',
  basePath: '/products',
};
      `,
    );

    // Boot & start the application
    await app.boot();
    await app.start();

    expect(toJSON(buildCalls)).to.deepEqual(
      toJSON([
        {
          application: app,
          modelClass: Product,
          config: {
            basePath: '/products',
            dataSource: 'db',
            pattern: 'stub',
          },
        },
      ]),
    );
  });

  it('throws if there are no patterns matching', async () => {
    await sandbox.copyFile(
      resolve(__dirname, '../fixtures/product.model.js'),
      'models/product.model.js',
    );

    await sandbox.writeTextFile(
      'model-endpoints/product.rest-config.js',
      `
const {Product} = require('../models/product.model');
module.exports = {
  model: Product,
  pattern: 'doesntExist',
  dataSource: 'db',
  basePath: '/products',
};
      `,
    );

    await expect(app.boot()).to.be.rejectedWith(
      /Unsupported API pattern "doesntExist"/,
    );
  });

  it('throws if the model class is invalid', async () => {
    await sandbox.copyFile(
      resolve(__dirname, '../fixtures/product.model.js'),
      'models/product.model.js',
    );

    await sandbox.writeTextFile(
      'model-endpoints/product.rest-config.js',
      `
const Product = 'product'
module.exports = {
  model: Product,
  pattern: 'stub',
  dataSource: 'db',
  basePath: '/products',
};
      `,
    );

    await expect(app.boot()).to.be.rejectedWith(
      /Invalid "model" field\. Expected a Model class, found product/,
    );
  });

  class BooterApp extends BootMixin(RepositoryMixin(RestApplication)) {
    constructor(options?: ApplicationConfig) {
      super(options);
      this.projectRoot = sandbox.path;
      this.booters(ModelApiBooter);
      this.component(StubModelApiBuilderComponent);
    }
  }

  async function givenAppWithDataSource() {
    app = new BooterApp({
      rest: givenHttpServerConfig(),
    });
    app.dataSource(new juggler.DataSource({connector: 'memory'}), 'db');
  }

  async function stopApp() {
    try {
      await app.stop();
    } catch (err) {
      // console.error('Cannot stop the app, ignoring the error.', err);
    }
  }
});
