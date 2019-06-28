import { Plugin, PluginRegistry } from './plugin';
import {
  calculateMissingDependencies,
  initPlugins,
  readyPlugins,
  registerPlugins,
} from './utils/core';

export default class Core {
  plugins: PluginRegistry = Object.create(null);

  /**
   * Register one or more plugins with Core.
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
