# SF-X Sayt Driver Plugin

This package contains the SF-X Sayt (Search-as-you-type) Driver plugin.

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

This plugin listens for and dispatches a number of events.

### Received

* `sfx::autocomplete_fetch_data`: When received, a request to the GroupBy Sayt API is made. An `sfx::autocomplete_received_results` event is dispatched with the results. In case of an error, the `sfx::autocomplete_sayt_error` event is dispatched instead.
* `sfx::sayt_products_request`: When received, a search request to the GroupBy API is made to receive products. An `sfx::sayt_products_response` event is dispatched with the results. In case of an error, the `sfx::sayt_products_error` event is dispatched instead.

### Dispatched

* `sfx::autocomplete_received_results`: Dispatched when a Sayt request has completed. Its payload is the result of the request and includes search autocomplete terms.
* `sfx::autocomplete_sayt_error`: Dispatched when an error has occurred during a Sayt request.
* `sfx::sayt_products_response`: Dispatched when a search request has completed. Its payload is the result of the request and includes products that may have been transformed.
* `sfx::sayt_products_error`: Dispatched when an error has occurred during a search request.
