# SFX Logic
SFX Logic SDK for integrating GroupBy's APIs into a front-end e-commerce application.

## Installation
To clone this repo with submodules run:
```
git clone --recursive https://github.com/groupby/sfx-logic
```
or if the repo is already cloned and you want to install submodules only, run:
```
git submodule update --init
```
## Setup
Run the `./scripts/setup.sh` script to build all of the SFX-Logic packages.
```sh
  ./scripts/setup.sh
```

## Commands
The following commands are run in the context of an individual package contained within the SFX-Logic monorepo. The individual packages can be found within the [`packages/@sfx`](packages/@sfx) directory.

### Building packages
To build an individual package, run the following command:
```sh
yarn build
```

To build an individual package in response to changes within the `src` directory, run the following command:
```sh
yarn dev
```

### Testing
Tests are run with [Mocha](https://mochajs.org/), [Chai](https://www.chaijs.com/), and [Sinon](https://sinonjs.org/) in Node. Alternatively, browser based testing is also supported and uses the [Karma test runner](https://karma-runner.github.io/latest/index.html). The following browsers are tested:

- Chrome

To run tests for a specific plugin package, navigate to its directory and use the following commands based on the desired testing flow:

- To run the tests for a specific package once:
```sh
yarn test
```
- To run the tests for a specific package and watch the `src` and `test` directories to rerun the tests after any changes:
```sh
yarn tdd
```
- To run the tests in a browser environment once:
```sh
yarn test:browser
```
- To run the tests in a browser environment while watching the `src` and `test` directories for any changes:
```sh
yarn tdd:browser
```

Test coverage is also provided using [Istanbul](https://github.com/istanbuljs/istanbuljs).

## Linting
This project ships with [ESLint](https://eslint.org/) configuration to enforce a consistent code style across `*.ts` files.

### Package-specific linting

The following commands are run in the context of an individual package contained within the SFX-Logic monorepo. The individual packages can be found within the [`packages/@sfx`](packages/@sfx) directory.

To lint files for an individual package, navigate to its directory and use one of the following commands.

- To lint the files under the `src` directory for an individual package:
```sh
yarn lint:scripts
```

- To lint the files under the `test` directory for an individual package:
```sh
yarn lint:test
```

To run the automated lint fixes for an individual package, navigate to its directory and use one of the following commands.

- To run automated lint fixes on the files under the `src` directory for an individual package:
```sh
yarn lint:scripts:fix
```

- To run automated lint fixes on the files under the `test` directory for an individual package:
```sh
yarn lint:tests:fix
```

### Project-wide linting

To lint all the SFX-Logic packages at once, run the following commands at the root of the monorepo:

- To lint all files within each package's `src` directory:
```sh
yarn lint:scripts
```

- To lint all files within each package's `test` directory:
```sh
yarn lint:tests
```

- To run automated lint fixes on all files within each package's `src` directory:
```sh
yarn lint:script:fix
```

- To run automated lint fixes on all files within each package's `test` directory:
```sh
yarn lint:tests:fix
```

## Documentation
The following command will generate documentation for each module in the `packages` directory. It uses [TypeDoc](https://typedoc.org/) and outputs to the `docs` directory.
```sh
yarn docs
```

## Bundling
To bundle the SFX-Logic packages, run the following command at the root of the monorepo:
```sh
yarn bundle
```

The resulting bundles can be found within the `dist` directory at the root of the repo.

## Usage
To use sfx-logic, point to a bundle with a script tag:

```html
<script src="your-sfx-logic-bundle"></script>
```

You can now instantiate Core and the plugins:

```js
const core = new sfxCore.Core();
const domEventsPlugin = new sfxPlugins.DomEventsPlugin()
const saytPlugin = new sfxPlugins.SaytPlugin({subdomain: 'apparel', collection: 'products'});
const saytDriverPlugin = new sfxPlugins.SaytDriverPlugin();
const searchPlugin = new sfxPlugins.SearchPlugin({ customerId: 'apparel', collection: 'products', area: 'Storefront'});
const searchDriverPlugin = new sfxPlugins.SearchDriverPlugin();

// register all plugins with core
core.register([saytPlugin, saytDriverPlugin, domEventsPlugin, searchPlugin, searchDriverPlugin]);
```

If you are additionally using `sfx-view`, or require the search data to be transformed to be ready for your own views, you should define a productTransformer function that accepts a `Record` (ie. a product as it is returned from a search) and pass it to the `saytDriverPlugin` and `searchDriverPlugin`:

```js
function productTransformer(record) {
  // ... transform a record/product in some way and return it
  return newProduct;
}

const core = new sfxCore.Core();
// ...instantiate other plugins

const saytDriverPlugin = new sfxPlugins.SaytDriverPlugin({ productTransformer });
const searchDriverPlugin = new sfxPlugins.SearchDriverPlugin({ productTransformer });
```
