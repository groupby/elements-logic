import { Plugin, PluginRegistry, PluginMetadata } from '@sfx/core';

export default class SaytDriverPlugin implements Plugin {
  get metadata(): PluginMetadata {
    return {
      name: 'sayt-driver-plugin',
      depends: [
        this.eventsPluginName,
        'sayt',
        'search_data_source',
      ],
    };
  }

  core: PluginRegistry;
  eventsPluginName: string = 'dom_events';
  saytDataEvent: string = 'fetch-sayt-data';
  saytProductsEvent: string = 'fetch-sayt-products';

  constructor() {
    this.fetchSaytData = this.fetchSaytData.bind(this);
  }

  register(plugins: PluginRegistry) {
    this.core = plugins;
  }

  ready() {
    this.core[this.eventsPluginName].registerListener(this.saytDataEvent, this.fetchSaytData);
  }

  unregister() {
    this.core[this.eventsPluginName].unregisterListener(this.saytDataEvent, this.fetchSaytData);
  }

  fetchSaytData(saytDataQuery: SaytDataPayload) {
    const response = this.sendSaytAPIRequest(saytDataQuery)
    this.core[this.eventsPluginName].dispatchEvent('sayt-data-response', response);
  }

  sendSaytAPIRequest(saytDataQuery: SaytDataPayload) {
    const { query, ...config } = saytDataQuery;
    return this.core.sayt.autocomplete(query, config, this.autocompleteCallback)
  }

  autocompleteCallback(x: undefined, response: any) {
    return response.result.searchTerms.map((term: any) => {
      return term.value;
    });
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
