// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/example-greeter-extension
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {config, Getter} from '@loopback/context';
import {extensionPoint, extensions} from '@loopback/core';
import {InfoObject} from 'openapi3-ts';
import {OpenApiSpec} from '../types';
import {
  OAISpecContributor,
  OAISPEC_CONTRIBUTOR_EXTENSION_POINT_NAME,
} from './types';

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
export class GreetingService {
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

  private _spec: Partial<OpenApiSpec> = {};

  /**
   * Find contributors for a given field
   * @param fieldName - The field name
   */
  async findContributors(
    fieldName: string,
  ): Promise<OAISpecContributor[] | undefined> {
    const contributors = await this.getContributors();
    return contributors.filter(c => c.fieldName === fieldName);
  }

  /**
   * Generate info spec from info contributors
   * Other spec generators TBD
   */
  async generateInfo(): Promise<InfoObject | undefined> {
    const infoContributors = await this.findContributors('info');
    if (!infoContributors) return;
    let infoSpec = {};
    for (const c of infoContributors) {
      await c.addSpec(infoSpec);
    }
    return infoSpec as InfoObject;
  }

  /**
   * Load all extensions and get the complete OpenAPI Spec
   * @param language - Language code
   * @param name - Name
   */
  async loadAllSpec(): Promise<OpenApiSpec> {
    const info = await this.generateInfo();
    this._spec.info = info;
    // TBD: load other fields `paths`, `security`, etc...
    return this._spec;
  }
}
