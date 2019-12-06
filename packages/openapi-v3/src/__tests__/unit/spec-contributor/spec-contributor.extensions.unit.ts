// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {expect} from '@loopback/testlab';
import {OAISpecEnhancerService} from '../../../';
import {SpecServiceApplication} from './fixtures/application';

describe('spec-enhancer-extension-point', () => {
  let app: SpecServiceApplication;
  let specService: OAISpecEnhancerService;

  beforeEach(givenAppWithSpecComponent);
  beforeEach(findSpecService);

  it('greets by language', async () => {
    const EXPECTED_SPEC = {
      openapi: '3.0.0',
      info: {title: 'LoopBack Test Application', version: '1.0.1'},
      paths: {},
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    };
    const specFromService = await specService.generateSpec();
    expect(specFromService).to.eql(EXPECTED_SPEC);
  });

  function givenAppWithSpecComponent() {
    app = new SpecServiceApplication();
  }

  async function findSpecService() {
    specService = await app.getSpecService();
  }
});
