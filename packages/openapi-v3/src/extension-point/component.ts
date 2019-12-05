import {createBindingFromClass} from '@loopback/context';
import {Component} from '@loopback/core';
import {SPEC_SERVICE} from './keys';
import {SpecService} from './spec-contributor.service';

export class SpecComponent implements Component {
  bindings = [
    createBindingFromClass(SpecService, {
      key: SPEC_SERVICE,
    }),
  ];
}
