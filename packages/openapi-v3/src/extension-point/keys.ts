// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingKey} from '@loopback/context';
import {OAISpecEnhancerService} from './spec-contributor.service';

/**
 * Strongly-typed binding key for SpecService
 */
export const OAISPEC_ENHANCER_SERVICE = BindingKey.create<
  OAISpecEnhancerService
>('services.SpecService');
