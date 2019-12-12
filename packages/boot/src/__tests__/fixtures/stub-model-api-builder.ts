// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {bind, Component, createBindingFromClass} from '@loopback/core';
import {
  asModelApiBuilder,
  ModelApiBuilder,
  ModelApiConfig,
} from '@loopback/model-api-builder';
import {get, Model} from '@loopback/rest';
import {BooterApp} from './application';

@bind(asModelApiBuilder)
class StubModelApiBuilder implements ModelApiBuilder {
  readonly pattern: string = 'stub';
  build(
    application: BooterApp,
    modelClass: typeof Model & {prototype: Model},
    cfg: ModelApiConfig,
  ): Promise<void> {
    application.controller(StubController);
    return Promise.resolve();
  }
}

// sample controller class
class StubController {
  @get('/products', {responses: {}})
  products() {
    return 'products';
  }
}

export class StubModelApiBuilderComponent implements Component {
  bindings = [createBindingFromClass(StubModelApiBuilder)];
}
