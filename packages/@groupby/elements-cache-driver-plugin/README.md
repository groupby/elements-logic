# SF-X Cache Plugin

This package contains the SF-X Cache Driver Plugin class.

## Usage

To use the plugin, simply instantiate it and register it with Core:

```js
const cacheDriverPlugin = new CacheDriverPlugin();
core.register(cacheDriverPlugin);
```

## Events

This plugin listens for and dispatches a number of events. These events are defined in the [`@sfx/events`][sfx-events] package.

### Received

* `CACHE_REQUEST`: When received, a request to the cache is made and a response is dispatched with the event name provided in the payload of `CACHE_REQUEST`.

### Dispatched

* A cache response event: Dispatched when a `CACHE_REQUEST` is fulfilled. The event is dispatched under the name provided with the corresponding `CACHE_REQUEST` payload.

[sfx-events]: https://github.com/groupby/sfx-events
