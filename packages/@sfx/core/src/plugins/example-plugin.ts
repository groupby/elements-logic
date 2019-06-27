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
}

export interface ExamplePluginOptions {
  foo: string;
  baz: boolean;
}
