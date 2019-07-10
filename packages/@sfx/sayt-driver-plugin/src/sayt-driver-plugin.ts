import { Plugin, PluginRegistry, PluginMetadata } from '@sfx/core';
import { Sayt, SaytConfig } from 'sayt';

export default class SaytDriverPlugin implements Plugin {
  get metadata(): PluginMetadata {
    return {
      name: 'sayt-driver-plugin',
      depends: [
        this.eventsPluginName,
        'sayt_data_source',
        'search_data_source',
      ],
    };
  }

  core: PluginRegistry;
  eventsPluginName: string = 'dom_events';
  saytDataEvent: string = 'fetch-sayt-data';
  saytProductsEvent: string = 'fetch-sayt-products';

  sayt: any = new Sayt({
    subdomain: 'cvshealth',
    https: true,
  });

  constructor() {
    this.fetchSaytData = this.fetchSaytData.bind(this);
    this.fetchSaytProducts = this.fetchSaytProducts.bind(this);
  }

  register(plugins: PluginRegistry) {
    this.core = plugins;
  }

  ready() {
    this.core[this.eventsPluginName].registerListener(this.saytDataEvent, this.fetchSaytData);
    this.core[this.eventsPluginName].registerListener(this.saytProductsEvent, this.fetchSaytProducts);
  }

  unregister() {
    this.core[this.eventsPluginName].unregisterListener(this.saytDataEvent, this.fetchSaytData);
    this.core[this.eventsPluginName].unregisterListener(this.saytProductsEvent, this.fetchSaytProducts);
  }

  fetchSaytData(saytDataQuery: SaytDataPayload) {
    const response = this.sendSaytAPIRequest(saytDataQuery)
    this.core[this.eventsPluginName].dispatchEvent('sayt-data-response', response);
  }

  sendSaytAPIRequest(saytDataQuery: SaytDataPayload) {
    const { query, ...config } = saytDataQuery;
    return this.sayt.autocomplete(query, config, this.autocompleteCallback)
  }

  autocompleteCallback(x: undefined, response: any) {
    return response.result.searchTerms.map((term: any) => {
      return term.value;
    });
  }

  async fetchSaytProducts(query: SaytHoverQuery) {
    let response;
    try {
      response = await this.core['search-data-source-plugin'].fetchProducts(query);
    } catch(e) {
      throw e;
    }

    this.core[this.eventsPluginName].dispatchEvent('sayt-products-response', response);
  }
}

export interface SaytDataPayload {
  query: string;
  collection?: string;
  language?: string;
  filter?: string;
  searchItems?: number;
  navigationItems?: number;
  fuzzy?: boolean;
}

export interface SaytHoverQuery {
  query: string;
  refinements: Refinement[];
}

export interface Refinement {
  [key: string]: string;
}
