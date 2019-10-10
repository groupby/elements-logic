// eslint-disable-next-line import/no-extraneous-dependencies, import/no-unresolved
import { Plugin, PluginRegistry, PluginMetadata } from '@sfx/core';
import {
  AUTOCOMPLETE_REQUEST,
  AUTOCOMPLETE_RESPONSE,
  AUTOCOMPLETE_ERROR,
  SAYT_PRODUCTS_REQUEST,
  SAYT_PRODUCTS_RESPONSE,
  SAYT_PRODUCTS_ERROR,
  AutocompleteRequestPayload,
  AutocompleteResultGroup,
  AutocompleteSearchTermItem,
  AutocompleteResponsePayload,
  AutocompleteErrorPayload,
  ProductTransformer,
  SaytProductsRequestPayload,
  SaytProductsResponsePayload,
  SaytProductsErrorPayload,
} from '@sfx/events';
// eslint-disable-next-line import/no-extraneous-dependencies, import/no-unresolved
import {
  AutocompleteResponse,
  // eslint-disable-next-line import/no-extraneous-dependencies, import/no-unresolved
  AutocompleteSearchTerm,
  // eslint-disable-next-line import/no-extraneous-dependencies, import/no-unresolved
  QueryTimeAutocompleteConfig,
  // eslint-disable-next-line import/no-extraneous-dependencies, import/no-unresolved
} from '@sfx/sayt-plugin';
// eslint-disable-next-line import/no-extraneous-dependencies, import/no-unresolved
import { Results, Record, Request as SearchRequest } from '@sfx/search-plugin';

/**
 * Driver plugin that serves as the link between the Sayt data source
 * and the View layer. This plugin is responsible for listening to events,
 * sending search requests to internal data source APIs,
 * and then emitting the API response back in an event.
 */
export default class SaytDriverPlugin<P = Record> implements Plugin {
  get metadata(): PluginMetadata {
    return {
      name: 'sayt_driver',
      depends: [
        this.eventsPluginName,
        'sayt',
        'search',
      ],
    };
  }

  /**
   * Holds reference to the plugin registry that is received in registration.
   */
  core: PluginRegistry;

  /**
   * Name of the events plugin.
   */
  eventsPluginName = 'dom_events';

  /**
   * Provide default configuration for SAYT product searches.
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
   * Binds relevant functions. Sets transformProduct property if a
   * product transformer function is passed.
   */
  constructor(options?: SaytDriverOptions) {
    this.fetchAutocompleteTerms = this.fetchAutocompleteTerms.bind(this);
    this.fetchProductData = this.fetchProductData.bind(this);
    this.autocompleteCallback = this.autocompleteCallback.bind(this);
    this.searchCallback = this.searchCallback.bind(this);

    const {
      productTransformer = ((product: Record): Record => product) as any,
    } = options;
    this.transformProduct = productTransformer;
  }

  /**
   * Sets the plugin registry to the plugin's internal 'core' property.
   * Callback method for when the plugin is registered in Core.
   *
   * @param plugins The plugin registry object from Core.
   */
  register(plugins: PluginRegistry): void {
    this.core = plugins;
  }

  /**
   * Lifecycle event where the plugin can first safely interact with the registry.
   * The method will register an event listener for Sayt and product data requests.
   */
  ready(): void {
    this.core[this.eventsPluginName].registerListener(AUTOCOMPLETE_REQUEST, this.fetchAutocompleteTerms);
    this.core[this.eventsPluginName].registerListener(SAYT_PRODUCTS_REQUEST, this.fetchProductData);
  }

  /**
   * Lifecycle event where the plugin will unregister all event listeners.
   */
  unregister(): void {
    this.core[this.eventsPluginName].unregisterListener(AUTOCOMPLETE_REQUEST, this.fetchAutocompleteTerms);
    this.core[this.eventsPluginName].unregisterListener(SAYT_PRODUCTS_REQUEST, this.fetchProductData);
  }

  /**
   * Sends a request to the Sayt API for autocomplete terms and dispatches
   * events on success and failure.
   *
   * @param event Event that contains the Sayt API request payload.
   */
  fetchAutocompleteTerms(event: CustomEvent<AutocompleteRequestPayload>): void {
    const { query, group, config } = event.detail;
    this.sendAutocompleteApiRequest(query, config)
      .then((results) => {
        const payload: AutocompleteResponsePayload = { results, group };
        this.core[this.eventsPluginName].dispatchEvent(AUTOCOMPLETE_RESPONSE, payload);
      })
      .catch((error) => {
        const payload: AutocompleteErrorPayload = { error, group };
        this.core[this.eventsPluginName].dispatchEvent(AUTOCOMPLETE_ERROR, payload);
      });
  }

  /**
   * Sends a request to the Search API for product data and dispatches
   * events on success and failure.
   *
   * @param event Event that contains the Search API request payload.
   */
  fetchProductData(event: CustomEvent<SaytProductsRequestPayload>): void {
    const { query, group, config } = event.detail;
    this.sendSearchApiRequest(query, config)
      .then((results) => {
        const payload: SaytProductsResponsePayload<P> = {
          ...results,
          group,
        };
        this.core[this.eventsPluginName].dispatchEvent(SAYT_PRODUCTS_RESPONSE, payload);
      })
      .catch((error) => {
        const payload: SaytProductsErrorPayload = { error, group };
        this.core[this.eventsPluginName].dispatchEvent(SAYT_PRODUCTS_ERROR, payload);
      });
  }

  /**
   * Sends a request to the SAYT API with the given query and config object.
   *
   * @param query The search term to send.
   * @param config Extra query-time configuration to customize the SAYT request.
   * @returns A promise from the Sayt API that has been reformatted
   * with the passed callback.
   */
  sendAutocompleteApiRequest(query: string, config: QueryTimeAutocompleteConfig): Promise<AutocompleteResultGroup[]> {
    return this.core.sayt.autocomplete(query, config).then(this.autocompleteCallback);
  }

  /**
   * Sends a request to the Search API with the given query and config object.
   *
   * @param query The search term to send.
   * @param config Extra query-time configuration to customize the Search request.
   * @returns A promise from the Search API that has been reformatted
   * with the passed callback.
   */
  sendSearchApiRequest(query: string, config: QueryTimeAutocompleteConfig): Promise<SaytProductsResponsePayload<P>> {
    return this.core.search.search({ ...this.defaultSearchConfig, query, ...config })
      .then(this.searchCallback);
  }

  /**
   * Extracts search terms from the given response.
   *
   * @param response An array of search term strings.
   * @returns An array of search term strings.
   */
  autocompleteCallback(response: AutocompleteResponse): AutocompleteResultGroup[] {
    const searchTerms = {
      title: '',
      items: response.result.searchTerms
        ? this.constructSearchTerms(response.result.searchTerms)
        : [],
    };
    return [searchTerms];
  }

  /**
   * Extracts query and products from the given response.
   * Calls `this.transformProduct` on each product found in the response.
   * Filters out any products that map to a falsy value.
   *
   * @param response An object containing the original search response.
   * @returns An object containing an array of valid simplified products and the original response.
   */
  searchCallback(searchResponse: Results): SaytProductsResponsePayload<P> {
    const { records } = searchResponse;
    const mappedRecords = records
      .map(this.transformProduct)
      .filter(Boolean);

    return {
      products: mappedRecords,
      originalResponse: searchResponse,
    };
  }

  /**
   * Formats a given list of search terms.
   *
   * @param terms An array of search terms.
   * @returns An array of search terms that have been formatted.
   */
  constructSearchTerms(terms: AutocompleteSearchTerm[]): AutocompleteSearchTermItem[] {
    return terms.filter((term) => term.value)
      .map((term) => ({ label: term.value }));
  }
}

export interface SaytDriverOptions {
  productTransformer?: ProductTransformer<any>;
}
