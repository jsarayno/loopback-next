// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {bind} from '@loopback/context';
import {
  asSpecContributor,
  OAISpecContributor,
} from '../../../../extension-point/types';
import {OpenApiSpec} from '../../../../types';

/**
 * A spec contributor to add OpenAPI info spec
 */
@bind(asSpecContributor)
export class InfoSpecContributor implements OAISpecContributor {
  addSpec(spec: OpenApiSpec) {
    spec.info = {
      title: 'LoopBack Test Application',
      version: '1.0.1',
    };
    return spec;
  }
}
