# GroupBy Elements Search Driver Plugin

This package contains the GB Elements Search Driver plugin.

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
These events are defined in the [`@groupby/elements-events`][elements-events] package.

[elements-events]: https://github.com/groupby/elements-events

### Received

* `SEARCH_REQUEST`: When received, a search request to the GroupBy
  API is made. A `SEARCH_RESPONSE` event is dispatched with the
  results.

### Dispatched

* `SEARCH_RESPONSE`: Dispatched when a search request has
  completed. Its payload is the result of the request.
* `SEARCH_ERROR`: Dispatched when an error has occurred during a
  search request.
* `TRACKER_SEARCH`: Dispatched when a search is made sucessfully. Its payload contains the search results and the origin of the action that triggered the search. This is listened to by our `GbTrackerPlugin` and can be listened to by any other custom trackers.
