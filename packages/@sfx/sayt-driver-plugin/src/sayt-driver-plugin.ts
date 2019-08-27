import { Plugin, PluginRegistry, PluginMetadata } from '@sfx/core';
import {
  AutocompleteResponse,
  AutocompleteSearchTerm,
  QueryTimeAutocompleteConfig,
} from '@sfx/sayt-plugin';

/**
 * Driver plugin that serves as the link between the Sayt data source
 * and the View layer. This plugin is responsible for listening to events,
 * sending search requests to internal data source APIs,
 * and then emitting the API response back in an event.
 */
export default class SaytDriverPlugin implements Plugin {
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
  eventsPluginName: string = 'dom_events';
  /**
   * Event name to listen for Sayt autocomplete requests.
   */
  saytDataEvent: string = 'sfx::autocomplete_fetch_data';
  /**
   * Event name for sending Sayt autocomplete responses.
   */
  saytResponseEvent: string = 'sfx::autocomplete_received_results';
  /**
   * Event name to listen for Sayt autocomplete errors.
   */
  saytErrorEvent: string = 'sfx::autocomplete_sayt_error';
  /**
   * Event name to listen for Sayt product requests.
   */
  productDataEvent: string = 'sfx::sayt_products_request';
  /**
   * Event name for sending Sayt product responses.
   */
  productResponseEvent: string = 'sfx::sayt_products_response';
  /**
   * Event name to listen for Sayt product errors.
   */
  productErrorEvent: string = 'sfx::sayt_products_error';
  /**
   * Provide default configuration for SAYT product searches.
   */
  defaultSearchConfig: object = {
    fields: ['*'],
  }

  constructor() {
    this.fetchSaytData = this.fetchSaytData.bind(this);
    this.fetchProductData = this.fetchProductData.bind(this);
    this.sendSaytApiRequest = this.sendSaytApiRequest.bind(this);
    this.sendSearchApiRequest = this.sendSearchApiRequest.bind(this);
    this.autocompleteCallback = this.autocompleteCallback.bind(this);
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
   * The method will register an event listener for listening to Sayt data requests
   * and product data requests.
   */
  ready(): void {
    this.core[this.eventsPluginName].registerListener(this.saytDataEvent, this.fetchSaytData);
    this.core[this.eventsPluginName].registerListener(this.productDataEvent, this.fetchProductData);
  }

  /**
   * Lifecycle event where the plugin will unregister all event listeners.
   */
  unregister(): void {
    this.core[this.eventsPluginName].unregisterListener(this.saytDataEvent, this.fetchSaytData);
    this.core[this.eventsPluginName].unregisterListener(this.productDataEvent, this.fetchProductData);
  }

  /**
   * Dispatches an event with the response from the sayt data
   * plugin and the associated searchbox ID.
   * Callback for the Sayt data request event listener.
   *
   * @param event Event that contains the Sayt API request payload.
   */
  fetchSaytData(event: CustomEvent<AutocompleteRequestConfig>): void {
    const { query, searchbox, config } = event.detail;
    this.sendSaytApiRequest(query, config)
      .then((results) => {
        this.core[this.eventsPluginName].dispatchEvent(this.saytResponseEvent, { results, searchbox });
      })
      .catch((e) => {
        this.core[this.eventsPluginName].dispatchEvent(this.saytErrorEvent, e);
      });
  }

  /**
  * Dispatches an event with the response from the search data
  * plugin and the associated searchbox ID.
  * Callback for the Search data request event listener.
  *
  * @param event Event that contains the Search API request payload.
  */
  fetchProductData(event: CustomEvent) {
    const { query, searchbox, config } = event.detail;
    this.sendSearchApiRequest(query, config)
      .then(results => {
        this.core[this.eventsPluginName].dispatchEvent(this.productResponseEvent, { results, searchbox });
      })
      .catch(e => {
        this.core[this.eventsPluginName].dispatchEvent(this.productErrorEvent, e);
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
  sendSaytApiRequest(query: string, config: QueryTimeAutocompleteConfig): Promise<string[]> {
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
  sendSearchApiRequest(query: string, config: QueryTimeAutocompleteConfig): Promise<ProductsResponseSection> {
    const allConfig = { ...this.defaultSearchConfig, ...config };
    return this.core.search.search({ query, ...allConfig }).then(this.searchCallback);
  }

  /**
   * Extracts search terms from the given response.
   *
   * @param response An array of search term strings.
   * @returns An array of search term strings.
   */
  autocompleteCallback(response: AutocompleteResponse): AutocompleteResponseSection[] {
    const searchTerms = {
      title: '',
      items: response.result.searchTerms
        ? this.constructSearchTerms(response.result.searchTerms)
        : [],
    };
    return [searchTerms];
  }

  // @TODO response is of type Results from API-JavaScript
  /**
   * Extracts products from the given response.
   *
   * @param response An object containing the original query and product records.
   * @returns An object containing the query and products.
   */
  searchCallback(response: any): ProductsResponseSection {
    const { query, records } = response;
    const mappedRecords = records.map(record => {
      return {
        title: record.allMeta.title,
        price: record.allMeta.visualVariants[0].nonvisualVariants[0].originalPrice,
        imageSrc: record.allMeta.visualVariants[0].productImage,
        imageAlt: record.allMeta.title,
        productUrl: 'https://www.google.com',
        // variants: ,
      }
    });
    return {
      query,
      products: mappedRecords,
    };
  }

  /**
   * Formats a given list of search terms.
   *
   * @param terms An array of search terms.
   * @returns An array of search terms that have been formatted.
   */
  constructSearchTerms(terms: AutocompleteSearchTerm[]): SearchTermItem[] {
    return terms.filter((term) => term.value)
      .map((term) => {
        return { label: term.value };
    });
  }
}

/**
 * The type of the sayt autocomplete request event payload.
 */
export interface AutocompleteRequestConfig {
  query: string;
  config?: QueryTimeAutocompleteConfig;
  searchbox?: string;
}
/**
 * Data section of the event payload for an autocomplete response.
 * Ex. searchTerms
 */
export interface AutocompleteResponseSection {
  title: string;
  items: any[];
}

/**
 * Sayt autocomplete item.
 */
export interface SearchTermItem {
  label: string;
}

export interface ProductsResponseSection {
  query: string;
  products: any[];
}
