// eslint-disable-next-line import/no-extraneous-dependencies
import { Plugin, PluginMetadata, PluginRegistry } from '@sfx/core';

/**
 * The SF-X cache driver plugin.
 * This plugin exposes an event-based interface to the SF-X cache.
 */
export default class CacheDriverPlugin implements Plugin {
  get metadata(): PluginMetadata {
    return {
      name: 'cache-driver',
      depends: ['cache', 'dom_events'],
    };
  }

  /**
   * A reference to the registry of plugins for internal use.
   */
  core: PluginRegistry;

  /**
   * Saves the plugin registry for later use. This plugin does not
   * expose a value.
   *
   * @param plugins the plugin registry to use.
   */
  register(plugins: PluginRegistry): void {
    this.core = plugins;
  }
}
