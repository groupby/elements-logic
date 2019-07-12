# SF-X SAYT Plugin

This package contains the SF-X SAYT Plugin class.

## Usage

To use the plugin, simply instantiate it and register it with Core:

```js
const saytPlugin = new SaytPlugin(/* options */);
core.register(saytPlugin);
```
The plugin registers an instance of the [Sayt client](https://www.npmjs.com/package/sayt) with Core.

The SaytPlugin constructor can accept options to configure the exposed Sayt client. See the [SaytConfig interface](https://github.com/groupby/sayt-client/blob/develop/src/core/sayt.ts#L77) for available options.
