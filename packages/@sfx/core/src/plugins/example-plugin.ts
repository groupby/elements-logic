import { Plugin, PluginMetadata } from "../plugin";

class ExamplePlugin implements Plugin {
  // 5 major props:
  // Metadata, Constructor, Register, Init, Ready

  get metadata() {
    return {
      // Name Prop: name of your plugin.
      name: 'plugin_name',
      // Depends Prop: takes an array of plugin names marked as hard dependencies.
      depends: ['plugin_dependency_name_1', 'plugin_dependency_name_2'],
    };
  }

  options: ExamplePluginOptions = {
    foo: 'bar',
    baz: true,
  }

  core: object;

  // Constructor takes in an options object.
  constructor(options: Partial<ExamplePluginOptions> = {}) {
    this.options = { ...this.options, ...options };
  }

  register(plugins) {
    this.core = plugins;
    // This method will return a value to expose. Generally it will return an object. The object will most likely return bound methods.
    return {

    };
  }

  // The init method gets called after all the plugins have been registered.
  init() {
    // On init you should conduct all setup tasks. These setup tasks should not assume the functionality of any other plugin is available at this time.
    // Try to complete as much setup as you can within the init method.
    // Note: Init should be simple and is expected to delegate complex tasks to other methods.
  }

  // The ready method gets called after all the init methods have resolved.
  ready() {
    // Within the ready method you can assume that all plugins are initialized and available.
    // This means that you can define tasks that depend on other plugins.
  }
}

export interface ExamplePluginOptions {
  foo: string;
  baz: boolean;
}
