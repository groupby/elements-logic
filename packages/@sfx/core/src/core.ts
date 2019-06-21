import { Plugin } from './plugin';

export default class Core {
  plugins = Object.create(null);

  /**
   * Register one or more plugins with Core.
   *
   * @param plugins An array of plugin instances to regsiter.
   */
  register(plugins: Plugin[]) {
    plugins.forEach((p) => p.register(this.plugins));
  }
}
