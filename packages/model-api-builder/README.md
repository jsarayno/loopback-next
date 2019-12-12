# @loopback/model-api-builder

Types and helpers for packages contributing Model API builders.

## Overview

The `@loopback/model-api-builder` package provides a contract for extensions
that contribute builders for repositories and controllers. Users can provide
their model classes and the extensions provided will build their repository and
controller based on the model.

## Installation

```sh
npm install --save @loopback/model-api-builder
```

## Basic use

An extension that contributes the repository and controller builders can be made
by implementing `ModelApiBuilder`:

```ts
import {
  asModelApiBuilder,
  ModelApiBuilder,
  ModelApiConfig,
} from '@loopback/model-api-builder';

@bind(asModelApiBuilder)
export class SampleApiBuilder implements ModelApiBuilder {
  readonly pattern: string = 'Sample';

  build(
    application: ApplicationWithRepositories,
    modelClass: typeof Model & {prototype: Model},
    config: ModelApiConfig,
  ): Promise<void> {
    // define repository setup here
    // ...
    // define controller setup here
    // ...
  }
}
```

## Contributions

- [Guidelines](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md)
- [Join the team](https://github.com/strongloop/loopback-next/issues/110)

## Contributors

See
[all contributors](https://github.com/strongloop/loopback-next/graphs/contributors).

## License

MIT
