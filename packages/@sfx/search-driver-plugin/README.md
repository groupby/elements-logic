# SF-X Search Driver Plugin

This package contains the SF-X Search Driver plugin.

## Prerequisites

This plugin depends on the following plugins:

- `dom_events`
- `search`

These plugins must be registered either before or in the same batch as
this plugin.

## Usage

To use the plugin, simply instantiate it and register it with Core:

```js
const searchDriverPlugin = new SearchDriverPlugin();
core.register(searchDriverPlugin);
```

This plugin currently does not accept any options.

## Events

This plugin listens for and dispatches a number of events.

### Received

* `sfx::search_request`: When received, a search request to the GroupBy
  API is made. An `sfx::search_response` event is dispatched with the
  results.

### Dispatched

* `sfx::search_response`: Dispatched when a search request has
  completed. Its payload is the result of the request.
* `sfx::search_error`: Dispatched when an error has occurred during a
  search request.
