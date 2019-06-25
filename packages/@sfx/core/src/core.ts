import { Plugin } from './plugin';
import { calculateMissingDependencies } from './utils/core';

export default class Core {
  plugins = Object.create(null);

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
    // ensure dependencies are valid
      // if not, exit/throw
    // call lifecycle methods on plugins
  }
}
