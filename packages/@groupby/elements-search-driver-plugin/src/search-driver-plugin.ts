import { Plugin, PluginRegistry, PluginMetadata } from '@groupby/elements-core';
import { Record, Results, Request as SearchRequest } from '@groupby/elements-search-plugin';
import {
  SEARCH_REQUEST,
  SEARCH_RESPONSE,
  SEARCH_ERROR,
  TRACKER_SEARCH,
  ProductTransformer,
  SearchRequestPayload,
  SearchResponsePayload,
  SearchErrorPayload,
  TrackerSearchPayload,
} from '@groupby/elements-events';

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
   * The product transformer that will transform a [[Record]] to
   * the desired form.
   */
  transformProduct: ProductTransformer<P>;

  /**
   * Constructs a new instance of the plugin and binds the necessary
   * callbacks.
   */
  constructor(options: SearchDriverOptions<P> = {}) {
    this.fetchSearchData = this.fetchSearchData.bind(this);
    this.searchCallback = this.searchCallback.bind(this);

    const {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
   * Performs a search with the given search term and configuration
   * and emits the result through an event. The result is emitted in a
   * [[SEARCH_RESPONSE]] event. If the search fails for any
   * reason, a [[SEARCH_ERROR]] is dispatched with the error.
   * Additionally emits a tracker event if search is successful.
   *
   * @param event the event whose payload is the search term.
   */
  fetchSearchData(event: CustomEvent<SearchRequestPayload>): void {
    // @TODO Pull 'origin' out of event.detail
    const { query, group, config } = event.detail;
    this.sendSearchApiRequest({ query, ...config })
      .then((results) => {
        const payload: SearchResponsePayload<P> = { ...results, group };
        this.core[this.eventsPluginName].dispatchEvent(SEARCH_RESPONSE, payload);
        if (this.core.cache) this.core.cache.set(`${SEARCH_RESPONSE}::${group}`, payload);
        // @TODO Pass origin string into dispatchSearchTrackerEvent()
        this.dispatchSearchTrackerEvent(results.originalResponse);
      })
      .catch((error) => {
        const payload: SearchErrorPayload = { error, group };
        this.core[this.eventsPluginName].dispatchEvent(SEARCH_ERROR, payload);
      });
  }

  /**
   * Sends a search request using the GroupBy API.
   *
   * @param request The request object that contains the search term and any extra parameters.
   */
  sendSearchApiRequest(request: Partial<SearchRequest>): Promise<SearchResponsePayload<P>> {
    const fullQuery = { ...this.defaultSearchConfig, ...request };
    return this.core.search.search(fullQuery)
      .then(this.searchCallback);
  }

  /**
   * Extracts query and products from the given response.
   * Calls [[transformProduct]] on each product found in the response.
   * Filters out any products that map to a falsy value.
   *
   * @param response An object containing the original query and product records.
   * @returns An object containing the query and an array of valid simplified products.
   */
  searchCallback(response: Results): SearchResponsePayload<P> {
    const { records } = response;
    const mappedRecords = records.map(this.transformProduct).filter(Boolean);

    return {
      originalResponse: response,
      products: mappedRecords,
    };
  }

  /**
   * Dispatches a search tracker event.
   *
   * @param results The results from the search response.
   */
  dispatchSearchTrackerEvent(results: Results): void {
    // @TODO Accept 'origin' string
    const trackerSearchPayload: TrackerSearchPayload = {
      results,
      origin: {
        // @TODO add search/sayt: true depending on origin string
        search: true,
      },
    };
    this.core[this.eventsPluginName].dispatchEvent(TRACKER_SEARCH, trackerSearchPayload);
  }
}

/**
 * The configuration options for [[SearchDriver]].
 *
 * @typeparam P The product type.
 */
export interface SearchDriverOptions<P> {
  /**
   * A function to transform a [[Record]] from the GroupBy Search API
   * to the desired form.
   */
  productTransformer?: ProductTransformer<P>;
}
