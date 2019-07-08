/**
 * A plugin for use with the SF-X Core. Plugins supply functionality to
 * the otherwise function-less Core. Plugins may depend on other
 * plugins.
 *
 * A plugin must conform to this interface to be registered with Core,
 * but it may define other methods and properties for internal use.
 */
export interface Plugin {
  /**
   * Plugin metadata. This object provides Core with the information
   * necessary to register the plugin.
   *
   * Plugin authors may consider using a getter to implement this
   * property.
   */
  metadata: PluginMetadata;

  /**
   * The callback for the registration phase of the lifecycle. The
   * plugin will receive a reference to the plugin registry (the object
   * through which other plugins can be accessed) here, and the function
   * is expected to return a value that will be exposed through the same
   * registry. It is recommended to store a reference to both values in
   * the plugin for later retrieval.
   *
   * The plugin cannot assume that other plugins are registered in this
   * function.
   *
   * @param plugins The plugin registry containing all other plugins.
   * @returns The value to expose in the registry.
   */
  register: (plugins: PluginRegistry) => any;

  /**
   * The callback for the initialization phase of the lifecycle. The
   * plugin should do as much setup as it can in this function.
   *
   * In this function, the plugin can assume that other plugins have
   * been registered and are accessible through the plugin registry
   * object given in the `register` function, but it cannot assume that
   * the other plugins have been initialized. In other words, the plugin
   * will know which plugins are available, but it cannot use them.
   */
  init?: () => void;

  /**
   * The callback for the ready phase of the lifecycle.
   *
   * In this function, the plugin can assume that other plugins have
   * been initialized and may safely use other plugins.
   */
  ready?: () => void;

  /**
   * The callback for the unregistration phase of the lifecycle. The
   * plugin is expected to perform teardown tasks in this function.
   *
   * In this function, the plugin can assume that other plugins are
   * still available to be used.
   */
  unregister?: () => void;
}

/**
 * Plugin metadata. Core will use the properties specified in this
 * interface during the registration process.
 */
export interface PluginMetadata {
  /**
   * The name of the plugin. This name will be used as the key in the
   * registry, so this name should be unique. By convention, this name
   * should be a valid JavaScript identifier and be written in
   * snake_case.
   */
  name: string;

  /**
   * The names of all the plugins that this plugin has a hard dependency
   * on (i.e. these plugins must be present for this plugin to
   * function).
   */
  depends: string[];
}

/**
 * The type of the plugin registry. Each key/value pair corresponds to
 * the name of a plugin and its exposed value.
 */
export interface PluginRegistry {
  [key: string]: any;
}


/**
 * The type of the plugin directory, which holds plugins keyed by name.
 */
export interface PluginDirectory {
  [name: string]: Plugin;
}
