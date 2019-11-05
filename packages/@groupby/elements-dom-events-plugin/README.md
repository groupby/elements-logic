# GroupBy Elements DOM Events Plugin

This package contains the GB Elements `DomEventsPlugin` class.

## Usage

To use the `DomEventsPlugin`, first instantiate it and then register it with
the Core entity:

```js
const domEventsPlugin = new DomEventsPlugin(/* options */);
core.register(domEventsPlugin);
```

The plugin's constructor takes an optional options object.
Please refer to the `DomEventsPluginOptions` interface in
[src/dom-events-plugin.ts](src/dom-events-plugin.ts) for more details on
available options.

## Methods
### registerListener()
Use the `registerListener` method to register event listeners. The method
takes an eventName and a callback function.

```js
registerListener(eventName, callback);
```

### unregisterListener()
Use the `unregisterListener` method to unregister event listeners. The method
takes an eventName and a callback function.

```js
unregisterListener(eventName, callback);
```

### dispatchEvent()
Use the `dispatchEvent` method to dispatch events. The method takes an
eventName and an option payload which can be used to send information
with the dispatched event.

```js
dispatchEvent(eventName, payload);
```
