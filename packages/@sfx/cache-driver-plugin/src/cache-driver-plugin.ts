// eslint-disable-next-line import/no-extraneous-dependencies
import { Plugin, PluginMetadata, PluginRegistry } from '@sfx/core';
import { CACHE_REQUEST, CacheRequestPayload } from '@sfx/events';

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

  constructor() {
    this.handleRequest = this.handleRequest.bind(this);
  }

  /**
   * Saves the plugin registry for later use. This plugin does not
   * expose a value.
   *
   * @param plugins the plugin registry to use.
   */
  register(plugins: PluginRegistry): void {
    this.core = plugins;
  }

  ready(): void {
    this.core.dom_events.registerListener(CACHE_REQUEST, this.handleRequest);
  }

  handleRequest(req: CacheRequestPayload): void {
    const data = this.core.cache.get(`${req.name}::${req.group}`);
    this.core.dom_events.dispatchEvent(req.returnEvent, data);
  }
}
