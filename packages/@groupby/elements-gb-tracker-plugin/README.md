# GroupBy Elements GB Tracker Plugin

This package contains the GroupBy Tracker Plugin class. Its purpose is to provide automatic beaconing integration with Groupby.

## Prerequisites

This plugin depends on the following plugins:

- `dom_events`

These plugins must be registered either before or in the same batch as
this plugin.

## Usage

To use the plugin, simply instantiate it and register it with Core:

```js
const gbTrackerPlugin = new GbTrackerPlugin('my-customer-id');
core.register(gbTrackerPlugin);
```

It accepts a mandatory `customerId`. It also accepts an optional `area`
argument to handle tracking actions against specific areas.

Additionally, the plugin will automatically listen for and act on tracking
events. It is designed to work with the other plugins in the Logic Layer.

The plugin registers an instance of the [gb-tracker client](https://www.npmjs.com/package/gb-tracker-client) with Core.

## Events

This plugin listens for a number of events.
These events are defined in the [`@groupby/elements-events`][elements-events] package.

[elements-events]: https://github.com/groupby/elements-events

### Received

* `TrackerSearchEvent`: When received, a GroupBy Search beacon is triggered.
