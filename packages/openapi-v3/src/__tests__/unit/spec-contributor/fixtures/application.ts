import {Application, createBindingFromClass} from '@loopback/core';
import {OAISpecEnhancerService, OAISPEC_ENHANCER_SERVICE} from '../../../../';
import {InfoSpecEnhancer} from './info.spec.extension';
import {SecuritySpecEnhancer} from './security.spec.extension';

export class SpecServiceApplication extends Application {
  constructor() {
    super();
    this.add(
      createBindingFromClass(OAISpecEnhancerService, {
        key: OAISPEC_ENHANCER_SERVICE,
      }),
    );
    this.add(createBindingFromClass(SecuritySpecEnhancer));
    this.add(createBindingFromClass(InfoSpecEnhancer));
  }

  async main() {}

  getSpecService() {
    return this.get(OAISPEC_ENHANCER_SERVICE);
  }
}
