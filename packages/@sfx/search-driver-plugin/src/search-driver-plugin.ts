import { Plugin, PluginRegistry, PluginMetadata } from '@sfx/core';
// import { Sayt, SaytConfig } from 'sayt';

/**
 * This plugin is responsible for exposing an instance of sayt
 * to Core.
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
   * Currently no need for an instructor, but the method needs to
   * exist for compatibility with Core.
   */
  constructor(options?: object) {}

  /**
   * 
   */
  register(plugins: PluginRegistry): void {
    this.core = plugins;
  }
}
