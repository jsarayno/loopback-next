// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingTemplate} from '@loopback/context';
import {extensionFor} from '@loopback/core';
import {OpenApiSpec} from '../types';

/**
 * Typically an extension point defines an interface as the contract for
 * extensions to implement
 */
export interface OAISpecEnhancer {
  // should we make it an async function?
  modifySpec(spec: OpenApiSpec): OpenApiSpec;
}

/**
 * Name/id of the oai spec contributor extension point
 */
export const OAISPEC_ENHANCER_EXTENSION_POINT_NAME = 'oai-spec-enhancer';

/**
 * A binding template for spec contributor extensions
 */
export const asSpecEnhancer: BindingTemplate = binding => {
  extensionFor(OAISPEC_ENHANCER_EXTENSION_POINT_NAME)(binding);
  // is it ok to have a different namespace than the extension point name?
  binding.tag({namespace: 'oai-spec-enhancer'});
};
