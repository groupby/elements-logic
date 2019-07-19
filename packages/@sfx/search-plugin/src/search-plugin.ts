import { Plugin, PluginRegistry, PluginMetadata } from '@sfx/core';
import { BridgeConfig, BrowserBridge, Query } from 'groupby-api';

/**
 * This plugin is responsible for exposing an instance of search browserBridge
 * to Core.
 */
export default class SearchPlugin implements Plugin {
  get metadata(): PluginMetadata {
    return {
      name: 'search-data-source',
      depends: [],
    };
  }

  /**
   * The values that the Search Data Source plugin expose to the Core entity.
   */
  browserBridge: BrowserBridge;
  exposedValue: SearchDataSourcePluginExposedValue;

  /**
   * The search data source plugin constructor instantiates an instance of the search browserBridge plugin
   * and attaches it to this plugin's broswerBridge property.
   *
   * @param options The options to instantiate the search data source browser bridge client with.
   */
  constructor(clientId: string, https: boolean, options?: BridgeConfig) {
    this.browserBridge = new BrowserBridge(clientId, https, options);
  }

  /**
   * Returns this plugin's instance of the search clients browser bridge.
   */
  register(): BrowserBridge {
    return this.browserBridge;
  }
}

/**
 * Search Data Source Plugin exposed value.
 */
export interface SearchDataSourcePluginExposedValue {
  query: Query,
}
