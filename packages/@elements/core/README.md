# GroupBy Elements Core

This package contains the GB Elements Core class and related plugin interfaces.

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
