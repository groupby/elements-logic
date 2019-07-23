import { Plugin, PluginRegistry, PluginMetadata } from '@sfx/core';
// import { Sayt, SaytConfig } from 'sayt';

/**
 * This plugin is responsible for exposing events that allow
 * for interacting with GroupBy's Search API.
 */
 export default class SearchDriverPlugin implements Plugin {
  get metadata(): PluginMetadata {
    return {
      name: 'search-driver',
      depends: ['dom_events', 'search_data_source'],
    };
  }

  /**
   * A reference to the registry of plugins for later use.
   */
  core: PluginRegistry;

  /**
   * This method needs to exist for compatibility with Core.
   */
  constructor(options?: SearchDriverOptions) {}

  /**
   * Accepts the exposed values of all plugins and saves them for later.
   */
  register(plugins: PluginRegistry): void {
    this.core = plugins;
  }

  /**
   * 
   */
  ready() {
    // @TODO Attach listeners for events
  }

  /**
   * @TODO Remove event listeners
   */
  unregister(): void {
  }
}

interface SearchDriverOptions {}
