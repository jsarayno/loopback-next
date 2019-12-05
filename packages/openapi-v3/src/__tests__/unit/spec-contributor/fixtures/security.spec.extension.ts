// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/openapi-v3
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {bind} from '@loopback/context';
import {ReferenceObject, SecuritySchemeObject} from '../../../../';
import {
  asSpecContributor,
  OAISpecContributor,
} from '../../../../extension-point/types';
import {OpenApiSpec} from '../../../../types';

export type SecuritySchemeObjects = {
  [securityScheme: string]: SecuritySchemeObject | ReferenceObject;
};

export const SECURITY_SCHEME_SPEC: SecuritySchemeObjects = {
  bearerAuth: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  },
};

/**
 * A spec contributor to add bearer token
 * OpenAPI security entry
 */
@bind(asSpecContributor)
export class SecuritySpecContributor implements OAISpecContributor {
  addSpec(spec: OpenApiSpec) {
    spec.components = spec.components ?? {};
    spec.components.securitySchemes = SECURITY_SCHEME_SPEC;
    return spec;
  }
}
