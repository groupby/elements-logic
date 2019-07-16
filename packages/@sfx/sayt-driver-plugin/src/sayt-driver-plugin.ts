import { Plugin, PluginRegistry, PluginMetadata } from '@sfx/core';

export default class SaytDriverPlugin implements Plugin {
  get metadata(): PluginMetadata {
    return {
      name: 'sayt_driver',
      depends: [
        this.eventsPluginName,
        'sayt',
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

  fetchSaytData(saytDataQuery: SaytDataPayload): void {
    const response = this.sendSaytAPIRequest(saytDataQuery)
    response.then((data: any) => {
      this.core[this.eventsPluginName].dispatchEvent('sayt-data-response', data)
    })
  }

  sendSaytAPIRequest(saytDataQuery: SaytDataPayload): Promise<string[]> {
    const { query, ...config } = saytDataQuery;
    return this.core.sayt.autocomplete(query, config, this.autocompleteCallback);
  }

  autocompleteCallback(x: undefined, response: any): string[] {
    return response.result.searchTerms.map((term: any) => {
      return term.value;
    });
  }
}

interface SaytDataPayload {
  query: string;
  collection?: string;
  language?: string;
  filter?: string;
  searchItems?: number;
  navigationItems?: number;
  fuzzy?: boolean;
}
