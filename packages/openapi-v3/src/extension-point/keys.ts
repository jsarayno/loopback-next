// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingKey} from '@loopback/context';
import {SpecService} from './spec-contributor.service';

/**
 * Strongly-typed binding key for SpecService
 */
export const SPEC_SERVICE = BindingKey.create<SpecService>(
  'services.SpecService',
);
