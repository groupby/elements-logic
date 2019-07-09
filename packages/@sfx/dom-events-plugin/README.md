# SF-X DOM Events Plugin

This package contains the SF-X DomEventsPlugin class.

## Usage

To use the DomEventsPlugin, first you must instantiate it:

```js
const domEventsPlugin = new DomEventsPlugin(options);
```

The plugin takes an options object, a user can provide a reference to
the window object and CustomEvents constructor in the following way:

```js
const options = {
  window: Window,
  CustomEvents: CustomEvents,
}
```

After instantiating the plugin you must register it with the Core entity:

```js
core.register(domEventsPlugin); 
```

## Methods
**registerListener():**
  - Use the registerListener method to register event listeners. The method
    takes an eventName and a callback function.

```js
registerListener(eventName, callback);
```

**unregisterListener():**
  - Use the unregisterListener method to unregister event listeners. The
    method takes an eventName and a callback function.

```js
unregisterListener(eventName, callback);
```

**dispatchEvent():**
  - Use the dispatchEvent method to dispatch events. The method takes an
    eventName and an option payload which can be used to send information
    with the dispatched event.

```js
dispatchEvent(eventName, payload);
```
