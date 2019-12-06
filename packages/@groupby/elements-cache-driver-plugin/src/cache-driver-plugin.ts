import { Plugin, PluginMetadata, PluginRegistry } from '@groupby/elements-core';
import { CACHE_REQUEST, CacheRequestPayload, CacheResponsePayload } from '@groupby/elements-events';

/**
 * The GroupBy Elements cache driver plugin.
 * This plugin exposes an event-based interface to the GB Elements cache.
 */
export default class CacheDriverPlugin implements Plugin {
  get metadata(): PluginMetadata {
    return {
      name: 'cache_driver',
      depends: ['cache', 'dom_events'],
    };
  }

  options: CacheDriverOptions = {};

  /**
   * A reference to the registry of plugins for internal use.
   */
  core: PluginRegistry;

  /**
   * Constructs a new instance of this plugin and binds the necessary
   * callbacks.
   */
  constructor(options: Partial<CacheDriverOptions> = {}) {
    this.options = { ...this.options, ...options };
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

  /**
   * Registers a number of event listeners.
   * The following events are listened for:
   *
   * - [[CACHE_REQUEST]]
   */
  ready(): void {
    this.core.dom_events.registerListener(CACHE_REQUEST, this.handleRequest);
  }

  /**
   * Dispatches the requested data from the cache.
   * The event name provided by the request is used as the name of the
   * return event.
   *
   * @param request The cache request details.
   */
  handleRequest(request: CustomEvent<CacheRequestPayload>): void {
    const { name, group, returnEvent } = request.detail;
    const data = this.core.cache.get(`${name}::${group || ''}`);
    const payload: CacheResponsePayload = { name, data, group };
    this.core.dom_events.dispatchEvent(returnEvent, payload);
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CacheDriverOptions {}
