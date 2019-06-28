import { Plugin, PluginRegistry } from './plugin';
import {
  calculateMissingDependencies,
  initPlugins,
  readyPlugins,
  registerPlugins,
} from './utils/core';

/**
 * The core of the SF-X plugin system. This entity is responsible for
 * managing plugins and provides a mechanism for plugins to communicate
 * with each other.
 */
export default class Core {
  /**
   * The plugin registry. This object is a dictionary containing plugin
   * names as keys and their corresponding exposed values as values.
   *
   * The preferred way to access plugins in the registry is through
   * another plugin. Accessing the plugins through Core outside of a
   * plugin is discouraged.
   */
  plugins: PluginRegistry = Object.create(null);

  /**
   * Register one or more plugins with Core.
   *
   * Plugins given here are registered as a batch: the next lifecycle
   * event does not occur until all plugins in this batch have
   * experienced the current lifecycle event.
   *
   * The registration lifecycle is as follows:
   *
   * 1. **Registration:** The registry is populated with each plugin's
   *    name and the value that it wants to expose. Plugins cannot
   *    assume that other plugins have been registered.
   * 2. **Initialization:** Plugins perform setup tasks. Plugins are
   *    aware of the existence of other plugins, but should not make use
   *    of their functionality as they may not yet be initialized.
   * 3. **Ready:** Plugins may make use of other plugins.
   *
   * This function ensures that all plugin dependencies are available
   * before proceeding to register the plugins. Circular dependencies
   * are supported. If dependencies are missing, an error will be
   * thrown.
   *
   * @param plugins An array of plugin instances to regsiter.
   */
  register(plugins: Plugin[]) {
    const missingDependencies = calculateMissingDependencies(plugins, this.plugins);
    if (missingDependencies.length) {
      throw new Error('Missing dependencies: ' + missingDependencies.join(', '));
    }

    registerPlugins(plugins, this.plugins);
    initPlugins(plugins);
    readyPlugins(plugins);
  }
}
