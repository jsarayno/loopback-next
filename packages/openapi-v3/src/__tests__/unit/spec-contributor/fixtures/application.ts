import {Application, createBindingFromClass} from '@loopback/core';
import {SpecService, SPEC_SERVICE} from '../../../../';
import {InfoSpecContributor} from './info.spec.extension';
import {SecuritySpecContributor} from './security.spec.extension';

export class SpecServiceApplication extends Application {
  constructor() {
    super();
    this.add(
      createBindingFromClass(SpecService, {
        key: SPEC_SERVICE,
      }),
    );
    this.add(createBindingFromClass(SecuritySpecContributor));
    this.add(createBindingFromClass(InfoSpecContributor));
  }

  async main() {}

  getSpecService() {
    return this.get(SPEC_SERVICE);
  }
}
