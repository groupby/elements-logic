# GroupBy Elements SAYT Driver Plugin

This package contains the GB Elements SAYT (Search-as-you-type) Driver plugin.

## Prerequisites

This plugin depends on the following plugins:

- `dom_events`
- `sayt`
- `search`

These plugins must be registered either before or in the same batch as
this plugin.

## Usage

To use the plugin, simply instantiate it and register it with Core:

```js
const saytDriverPlugin = new SaytDriverPlugin({});
core.register(saytDriverPlugin);
```

This plugin accepts the following options:
* `productTransformer` (optional)
    * A function that accepts a Record object and returns a transformed
    product. This argument is only necessary if the View Layer is being
    used. More generally, this function is an opportunity to transform
    the data into a useable format for your application's front-end.

## Events

This plugin listens for and dispatches a number of events. These events are defined in the [`@elements/events`][elements-events] package.

### Received

* `AUTOCOMPLETE_REQUEST`: When received, a request to the GroupBy SAYT API is made. An `AUTOCOMPLETE_RESPONSE` event is dispatched with the results. In case of an error, the `AUTOCOMPLETE_ERROR` event is dispatched instead.
* `SAYT_PRODUCTS_REQUEST`: When received, a search request to the GroupBy API is made to receive products. An `SAYT_PRODUCTS_RESPONSE` event is dispatched with the results. In case of an error, the `SAYT_PRODUCTS_ERROR` event is dispatched instead.

### Dispatched

* `AUTOCOMPLETE_RESPONSE`: Dispatched when a Sayt request has completed. Its payload is the result of the request and includes search autocomplete terms.
* `AUTOCOMPLETE_ERROR`: Dispatched when an error has occurred during a Sayt request.
* `SAYT_PRODUCTS_RESPONSE`: Dispatched when a search request has completed. Its payload is the result of the request and includes products that may have been transformed.
* `SAYT_PRODUCTS_ERROR`: Dispatched when an error has occurred during a search request.

[elements-events]: https://github.com/groupby/elements-events
