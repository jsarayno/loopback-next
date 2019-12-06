// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/example-greeter-extension
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {config, Getter} from '@loopback/context';
import {extensionPoint, extensions} from '@loopback/core';
import * as debugModule from 'debug';
import * as _ from 'lodash';
import {inspect} from 'util';
import {OpenApiSpec} from '../types';
import {OAISpecEnhancer, OAISPEC_ENHANCER_EXTENSION_POINT_NAME} from './types';
const debug = debugModule('loopback:openapi:spec-contributor');

/**
 * Options for the OAI Spec contributor extension point
 */
export interface OAISpecContributorServiceOptions {
  // no-op
}

/**
 * An extension point for OAI contributors
 */
@extensionPoint(OAISPEC_ENHANCER_EXTENSION_POINT_NAME)
export class OAISpecEnhancerService {
  constructor(
    /**
     * Inject a getter function to fetch spec contributors
     */
    @extensions()
    private getContributors: Getter<OAISpecEnhancer[]>,
    /**
     * An extension point should be able to receive its options via dependency
     * injection.
     */
    @config()
    public readonly options?: OAISpecContributorServiceOptions,
  ) {}

  private _spec: OpenApiSpec = {
    openapi: '3.0.0',
    info: {
      title: 'LoopBack Application',
      version: '1.0.0',
    },
    paths: {},
  };

  get spec(): OpenApiSpec {
    return this._spec;
  }
  set spec(value: OpenApiSpec) {
    this._spec = value;
  }

  /**
   * Generate OpenAPI spec from contributors
   */
  async generateSpec(options = {}): Promise<OpenApiSpec> {
    const contributors = await this.getContributors();
    if (_.isEmpty(contributors)) return this._spec;
    for (const c of contributors) {
      c.modifySpec(this._spec);
    }
    debug(`generated spec: ${inspect(this._spec, {depth: 10})}`);
    return this._spec;
  }
}
