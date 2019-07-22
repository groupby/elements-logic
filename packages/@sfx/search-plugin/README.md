# SF-X Search Plugin

This package contains the SF-X Search Plugin class.

## Usage

To use the plugin, simply instantiate it and register it with Core:

```js
const searchPlugin = new SearchPlugin(/* options -must contain a customerId parameter and valid value*/);
core.register(searchPlugin);
```
The plugin registers an instance of the [Search API client](https://www.npmjs.com/package/groupby-api) with Core.

The SearchPlugin constructor requires a customerId be passed. All other options properties are optional as Search will use the default settings to configure the exposed Search BrowserBridge client unless otherwise specified. See the [Search API browserBridge interface](https://github.com/groupby/api-javascript/blob/0bc32ac7c3e186b1c74b9918800b4d754a91afa4/src/core/bridge.ts#L223) for details.
