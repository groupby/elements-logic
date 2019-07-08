# SF-X Dom Events Plugin

This package contains the SF-X DomEventsPlugin class.

## Usage

To use Core, simply instantiate it:

```js
const core = new Core();
```

## Registering a plugin

To register one or more plugins with Core, instantiate the plugins, then
pass them to `Core.register()`:

```js
const core = new Core();
const pluginA = new PluginA();
const pluginB = new PluginB();

core.register([pluginA, pluginB]);
```

A plugin may take configuration options in its constructor. Refer to the
plugin's documentation for details.
