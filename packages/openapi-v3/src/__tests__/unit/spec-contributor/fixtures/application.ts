import {Application, createBindingFromClass} from '@loopback/core';
import {SpecComponent, SPEC_SERVICE} from '../../../../';
import {InfoSpecContributor} from './info.spec.extension';
import {SecuritySpecContributor} from './security.spec.extension';

export class SpecServiceApplication extends Application {
  constructor() {
    super();
    this.component(SpecComponent);
    this.add(createBindingFromClass(SecuritySpecContributor));
    this.add(createBindingFromClass(InfoSpecContributor));
  }

  async main() {}

  async getSpecService() {
    return this.get(SPEC_SERVICE);
  }
}
