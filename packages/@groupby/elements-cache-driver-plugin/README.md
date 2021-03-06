# GroupBy Elements Cache Plugin

This package contains the GroupBy Elements Cache Driver Plugin class.

## Usage

To use the plugin, simply instantiate it and register it with Core:

```js
const cacheDriverPlugin = new CacheDriverPlugin();
core.register(cacheDriverPlugin);
```

## Events

This plugin listens for and dispatches a number of events. These events are defined in the [`@groupby/elements-events`][elements-events] package.

### Received

* `CACHE_REQUEST`: When received, a request to the cache is made and a response is dispatched with the event name provided in the payload of `CACHE_REQUEST`.
  It is recommended to prefix the return event name with the value of `CACHE_RESPONSE_PREFIX`.

### Dispatched

* A cache response event: Dispatched when a `CACHE_REQUEST` is fulfilled.
  The event is dispatched under the name provided by the corresponding `CACHE_REQUEST` payload.

[elements-events]: https://github.com/groupby/elements-events
