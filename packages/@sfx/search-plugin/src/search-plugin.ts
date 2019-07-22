import { Plugin, PluginRegistry, PluginMetadata } from '@sfx/core';
import { BridgeConfig, BrowserBridge, Query } from 'groupby-api';

/**
 * This plugin exposes an instance of the GroupBy search client.
 */
export default class SearchPlugin implements Plugin {
  get metadata(): PluginMetadata {
    return {
      name: 'search',
      depends: [],
    };
  }

  /**
   * The values that the Search Data Source plugin expose to the Core entity.
   */
  browserBridge: SearchPluginExposedValue;

  /**
   * Instantiates an instance of the search BrowserBridge client.
   *
   * @param options The options to instantiate the search data source browser bridge client with.
   */
   constructor(options: SearchPluginOptions) {
     const customerId = options.customerId;
     const https = !!options.https;

     if (!customerId) {
       throw new Error('customerId is not valid');
     }

     const exposedValue: any = new BrowserBridge(customerId, https, options);
     exposedValue.Query = Query;
     this.browserBridge = exposedValue;
   }

  /**
   * Returns this plugin's instance of the search client.
   */
  register() {
    return this.browserBridge;
  }
}

/**
 * The type of this plugin's exposed value.
 */
export interface SearchPluginExposedValue extends BrowserBridge {
  Query: typeof Query;
}

/**
 * The type of this plugin's options.
 */
export interface SearchPluginOptions extends BridgeConfig{
  customerId: string,
  https?: boolean,
}
