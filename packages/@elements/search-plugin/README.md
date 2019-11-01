# GroupBy Elements Search Plugin

This package contains the GB Elements Search Plugin class.

## Usage

To use the plugin, simply instantiate it and register it with Core:

```js
const searchPlugin = new SearchPlugin({
  customerId: 'mycustomerid', // replace with your customer ID
  https: true,                // optional. Default: true
  // ... BrowserBridge options
});
core.register(searchPlugin);
```

The plugin registers an instance of the [Search API client](https://www.npmjs.com/package/groupby-api) with Core.

### Options

The SearchPlugin constructor takes in an options object to configure the
plugin.

* `customerId`: **Required.** This is your GroupBy customer ID.
* `https`: Use HTTPS. Default: `true`.
* All [`BrowserBridge` options][BrowserBridge options].

[BrowserBridge options]: https://github.com/groupby/api-javascript/blob/0bc32ac7c3e186b1c74b9918800b4d754a91afa4/src/core/bridge.ts#L238-L241
