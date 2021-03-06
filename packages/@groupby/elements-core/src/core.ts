import { Plugin, PluginDirectory, PluginRegistry } from './plugin';
import {
  calculateMissingDependencies,
  initPlugins,
  readyPlugins,
  registerPlugins,
  unregisterPlugins,
} from './utils/core';
import {
  DependencyGraph,
  createDependencyGraph,
  mergeDependencyGraphs,
  removeFromDependencyGraph,
} from './utils/dependencies';

/**
 * The core of the GroupBy Elements plugin system. This entity is responsible for
 * managing plugins and provides a mechanism for plugins to communicate
 * with each other.
 */
export default class Core {
  /**
   * The plugin registry. This object is a dictionary containing plugin
   * names as keys and their corresponding exposed values as values.
   *
   * The preferred way to access plugins in the registry is through
   * another plugin. Accessing the registry through Core outside of a
   * plugin is discouraged.
   */
  registry: PluginRegistry = Object.create(null);

  /**
   * The plugin directory. This object is a dictionary containing plugin
   * names as keys and the plugin objects as values.
   *
   * Plugins do not have access to this directory.
   */
  directory: PluginDirectory = Object.create(null);

  /**
   * An object with plugin names mapped to the names of the plugins that
   * depend on it. This dependency graph is represented as an adjacency
   * list.
   */
  dependencyGraph: DependencyGraph = createDependencyGraph();

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
   * 3. **Ready:** Registration is complete. All plugins have been
   *    initialized, and plugins may make use of other plugins.
   *
   * This function ensures that all plugin dependencies are available
   * before proceeding to register the plugins. Circular dependencies
   * are supported. If dependencies are missing, an error will be
   * thrown.
   *
   * @param plugins An array of plugin instances to register.
   */
  register(plugins: Plugin[]): void {
    const missingDependencies = calculateMissingDependencies(plugins, this.registry);
    if (missingDependencies.length) {
      throw new Error(`Missing dependencies: ${missingDependencies.join(', ')}`);
    }

    registerPlugins(plugins, this.registry, this.directory);
    this.dependencyGraph = mergeDependencyGraphs(this.dependencyGraph, createDependencyGraph(plugins));

    initPlugins(plugins);
    readyPlugins(plugins);
  }

  /**
   * Unregisters the given plugins. The plugin registry, directory and
   * dependency graph are all updated. The optional `unregister`
   * function of each plugin is called when the plugin is unregistered.
   * The order in which the plugins are unregistered is unspecified.
   *
   * @param plugins The names of the plugins to unregister.
   * @throws If unregistering a plugin will break a dependency.
   */
  unregister(plugins: string[]): void {
    const updatedGraph = removeFromDependencyGraph(this.dependencyGraph, plugins);
    unregisterPlugins(plugins, this.registry, this.directory);
    this.dependencyGraph = updatedGraph;
  }

  /**
   * Unregisters all plugins. The plugin registry, directory and
   * dependency graph are all cleared. The optional `unregister`
   * function of each plugin is called when the plugin is unregistered.
   * The order in which the plugins are unregistered is unspecified.
   */
  unregisterAll(): void {
    unregisterPlugins(Object.keys(this.directory), this.registry, this.directory);
    this.dependencyGraph = createDependencyGraph();
  }
}
