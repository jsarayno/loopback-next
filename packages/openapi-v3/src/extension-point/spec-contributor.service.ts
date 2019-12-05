// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/example-greeter-extension
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {config, Getter} from '@loopback/context';
import {extensionPoint, extensions} from '@loopback/core';
import * as debugModule from 'debug';
import {inspect} from 'util';
import {OpenApiSpec} from '../types';
import {
  OAISpecContributor,
  OAISPEC_CONTRIBUTOR_EXTENSION_POINT_NAME,
} from './types';
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
@extensionPoint(OAISPEC_CONTRIBUTOR_EXTENSION_POINT_NAME)
export class SpecService {
  constructor(
    /**
     * Inject a getter function to fetch spec contributors
     */
    @extensions()
    private getContributors: Getter<OAISpecContributor[]>,
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

  /**
   * Find contributors for a given field
   * @param fieldName - The field name
   */
  async findContributors(): Promise<OAISpecContributor[] | undefined> {
    return this.getContributors();
  }

  /**
   * Generate info spec from contributors
   */
  async generateSpec(options = {}): Promise<OpenApiSpec> {
    const contributors = await this.findContributors();
    if (!contributors) return this._spec;
    for (const c of contributors) {
      await c.addSpec(this._spec);
    }
    debug(`generated spec: ${inspect(this._spec, {depth: 10})}`);
    return this._spec;
  }
}
