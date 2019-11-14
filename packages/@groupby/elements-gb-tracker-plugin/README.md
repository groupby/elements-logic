# GroupBy Elements GB Tracker Plugin

This package contains the GroupBy Tracker Plugin class. Its purpose is to provide automatic beaconing integration with Groupby.

## Usage

To use the plugin, simply instantiate it and register it with Core:

```js
const gbTrackerPlugin = new GbTrackerPlugin(/* options */);
core.register(gbTrackerPlugin);
```
The plugin registers an instance of the [gb-tracker client](https://www.npmjs.com/package/gb-tracker-client) with Core.

<!-- The GbTrackerPlugin constructor can accept options to configure the exposed Sayt client. See the [SaytConfig interface](https://github.com/groupby/sayt-client/blob/develop/src/core/sayt.ts#L77) for available options. -->
