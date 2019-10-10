// eslint-disable-next-line import/no-extraneous-dependencies, import/no-unresolved
import { Plugin, PluginRegistry, PluginMetadata } from '@sfx/core';
import { Record, Results, Request as SearchRequest } from '@sfx/search-plugin';
import {
  SEARCH_REQUEST,
  SEARCH_RESPONSE,
  SEARCH_ERROR,
  Product,
  ProductTransformer,
  SearchRequestPayload,
  SearchResponsePayload,
  SearchResponseSection,
  SearchErrorPayload,
} from '@sfx/events';

/**
 * This plugin is responsible for exposing events that allow
 * for interacting with GroupBy's Search API.
 */
export default class SearchDriverPlugin<P = Record> implements Plugin {
  get metadata(): PluginMetadata {
    return {
      name: 'search_driver',
      depends: [this.eventsPluginName, 'search'],
    };
  }

  /**
   * A reference to the registry of plugins for later use.
   */
  core: PluginRegistry;

  /**
   * Name of the events plugin.
   */
  eventsPluginName = 'dom_events';

  /**
   * Default configuration for all searches.
   */
  defaultSearchConfig: Partial<SearchRequest> = {
    fields: ['*'],
  }

  /**
   * Default product transformer identity function.
   * Intended to be overwritten by passing a custom product transformer.
   *
   * @param product The product to be returned as-is.
   * @returns The received product object.
   */
  transformProduct: ProductTransformer<P> = ((product: Record): Record => product) as any;

  /**
   * Constructs a new instance of the plugin and binds the necessary
   * callbacks.
   */
  constructor(options: SearchDriverOptions = {}) {
    this.fetchSearchData = this.fetchSearchData.bind(this);
    this.searchCallback = this.searchCallback.bind(this);

    const {
      productTransformer = ((product: Record): Record => product) as any,
    } = options;

    this.transformProduct = productTransformer;
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
   * Registers event listeners. The following events are listened for:
   *
   * - [[SEARCH_REQUEST]]
   */
  ready(): void {
    this.core[this.eventsPluginName].registerListener(SEARCH_REQUEST, this.fetchSearchData);
  }

  /**
   * Unregisters event listeners.
   */
  unregister(): void {
    this.core[this.eventsPluginName].unregisterListener(SEARCH_REQUEST, this.fetchSearchData);
  }

  /**
   * Performs a search with the given search term and emits the result
   * through an event. The result is emitted in a
   * [[SEARCH_RESPONSE]] event. If the search fails for any
   * reason, a [[SEARCH_ERROR]] is dispatched with the error.
   *
   * @param event the event whose payload is the search term.
   */
  fetchSearchData(event: CustomEvent<SearchRequestPayload>): void {
    const { query, group } = event.detail;
    this.sendSearchApiRequest(query)
      .then((results) => {
        const payload: SearchResponsePayload<P> = { results, group };
        this.core[this.eventsPluginName].dispatchEvent(SEARCH_RESPONSE, payload);
      })
      .catch((error) => {
        const payload: SearchErrorPayload = { error, group };
        this.core[this.eventsPluginName].dispatchEvent(SEARCH_ERROR, payload);
      });
  }

  /**
   * Sends a search request using the GroupBy API.
   *
   * @param query the query to send.
   */
  sendSearchApiRequest(query: string): Promise<SearchResponseSection<P>> {
    const fullQuery = { ...this.defaultSearchConfig, query };
    return this.core.search.search(fullQuery)
      .then(this.searchCallback);
  }

  /**
   * Extracts query and products from the given response.
   * Calls `this.transformProduct` on each product found in the response.
   * Filters out any products that map to a falsy value.
   *
   * @param response An object containing the original query and product records.
   * @returns An object containing the query and an array of valid simplified products.
   */
  searchCallback(response: Results): SearchResponseSection<P> {
    const { records } = response;
    const mappedRecords = records.map(this.transformProduct).filter(Boolean);

    return {
      originalResponse: response,
      products: mappedRecords,
    };
  }
}

export interface SearchDriverOptions {
  productTransformer?: ProductTransformer<Product>;
}
