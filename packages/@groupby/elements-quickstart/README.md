# GroupBy Elements Quick Start

This package contains the GB Elements quick start pack.

## Usage

To use the starter pack, call the `quickStart` function with a customer ID.
For example:

```js
const core = quickStart({
  customerId: 'mycustomerid',  // replace with your customer ID
  productTransformer: (product) => { /* ... */ }, // optional but recommended
  pluginOptions: {             // optional
    // ...
  },
});
```

The `quickStart` function will return an instance of Elements Core
with all of the Elements plugins registered.

### Options

The `quickStart` function accepts an options object to configure the plugins.

* `customerId`: **Required.** This is your GroupBy customer ID. It will
  be passed to `SaytPlugin` and `SearchPlugin`.
* `productTransformer`: Optional, but recommended.
  This is a function that transforms the product records received
  from the GroupBy API into an Elements Product object. This will be
  passed to the `SaytDriverPlugin` and `SearchDriverPlugin`.
* `pluginOptions`: Optional. This is an object that allows you to configure individual plugins.
  The object provides plugin options, where the keys are the plugin names (`search`, `search_driver`, etc.),
  and the values are the corresponding plugin options.
  All properties supported by this object are optional.

  Supported keys are:
  * `cache`
  * `cache_driver`
  * `dom_events`
  * `gb_tracker`
  * `sayt`
  * `sayt_driver`
  * `search`
  * `search_driver`
