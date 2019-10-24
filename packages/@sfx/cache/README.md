# SF-X Cache Plugin

This package contains the SF-X Cache Plugin class.

## Usage

To use the plugin, simply instantiate it and register it with Core:

```js
const cachePlugin = new CachePlugin();
core.register(cachePlugin);
```

This plugin registers an instance of `Map` that is intended to be used by
other plugins as a cache or other data store. No automatic cache
clearing or expiring is performed.
