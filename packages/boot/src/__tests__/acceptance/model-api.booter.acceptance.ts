// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {ApplicationConfig} from '@loopback/core';
import {juggler, RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  createRestAppClient,
  expect,
  givenHttpServerConfig,
  TestSandbox,
} from '@loopback/testlab';
import {resolve} from 'path';
import {BootMixin, ModelApiBooter} from '../..';
import {StubModelApiBuilderComponent} from '../fixtures/stub-model-api-builder';

describe('rest booter acceptance tests', () => {
  let app: BooterApp;
  const SANDBOX_PATH = resolve(__dirname, '../../.sandbox');
  const sandbox = new TestSandbox(SANDBOX_PATH);

  beforeEach('reset sandbox', () => sandbox.reset());
  beforeEach(givenAppWithDataSource);

  afterEach(stopApp);

  it('gets simple controller path', async () => {
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
    const client = createRestAppClient(app);

    const response = await client.get('/products').expect(200);
    expect(response.text).to.eql('products');
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

    // Boot & start the application
    await expect(app.boot()).to.be.rejectedWith(
      /Unsupported API pattern "doesntExist"/,
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
