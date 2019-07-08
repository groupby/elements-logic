import { Plugin, PluginRegistry, PluginMetadata } from '@sfx/core';

export default class SaytDriverPlugin implements Plugin {
  get metadata(): PluginMetadata {
    return {
      name: 'sayt-driver-plugin',
      depends: ['events-browser-plugin', 'sayt-data-source-plugin']
    };
  }

  core: PluginRegistry

  constructor() {
    this.fetchSaytData = this.fetchSaytData.bind(this);
    this.fetchSaytProducts = this.fetchSaytProducts.bind(this);
  }

  register(plugins: PluginRegistry) {
    this.core = plugins;

    return {};
  }

  ready() {
    this.core['events-browser-plugin'].registerListener('fetch-sayt-data', this.fetchSaytData);
    this.core['events-browser-plugin'].registerListener('fetch-sayt-products', this.fetchSaytProducts);
  }

  async fetchSaytData(saytDataQuery: SaytDataPayload) {
    let response;
    try {
      response = await this.core['sayt-data-source-plugin'].fetchSaytData(saytDataQuery);
    } catch(err) {
      throw err;
    }

    this.core['events-browser-plugin'].dispatchEvent('sayt-data-response', response);
  }

  async fetchSaytProducts(query: SaytHoverQuery) {
    let response;
    try {
      response = await this.core['search-data-source-plugin'].fetchSaytProducts(query);
    } catch(err) {
      throw err;
    }

    this.core['events-browser-plugin'].dispatchEvent('sayt-products-response', response);
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
