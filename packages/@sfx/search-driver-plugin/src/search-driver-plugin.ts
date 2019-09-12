import { Plugin, PluginRegistry, PluginMetadata } from '@sfx/core';
import { Results, Request as SearchRequest } from '@sfx/search-plugin';
import {
  SEARCH_REQUEST_EVENT,
  SEARCH_RESPONSE_EVENT,
  SEARCH_ERROR_EVENT,
} from './events';

/**
 * This plugin is responsible for exposing events that allow
 * for interacting with GroupBy's Search API.
 */
export default class SearchDriverPlugin implements Plugin {
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
  eventsPluginName: string = 'dom_events';

  /**
   * Default configuration for all searches.
   */
  defaultSearchConfig: Partial<SearchRequest> = {
    fields: ['*'],
  }

  /**
   * Constructs a new instance of the plugin and binds the necessary
   * callbacks.
   */
  constructor() {
    this.fetchSearchData = this.fetchSearchData.bind(this);
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
   * - [[SEARCH_REQUEST_EVENT]]
   */
  ready() {
    this.core[this.eventsPluginName].registerListener(SEARCH_REQUEST_EVENT, this.fetchSearchData);
  }

  /**
   * Unregisters event listeners.
   */
  unregister(): void {
    this.core[this.eventsPluginName].unregisterListener(SEARCH_REQUEST_EVENT, this.fetchSearchData);
  }

  /**
   * Performs a search with the given search term and emits the result
   * through an event. The result is emitted in a
   * [[SEARCH_RESPONSE_EVENT]] event. If the search fails for any
   * reason, a [[SEARCH_ERROR_EVENT]] is dispatched with the error.
   *
   * @param event the event whose payload is the search term.
   */
  fetchSearchData(event: CustomEvent<SearchRequestPayload>): void {
    const { value: searchTerm, searchbox } = event.detail;
    this.sendSearchApiRequest(searchTerm)
      .then((results) => {
        this.core[this.eventsPluginName].dispatchEvent(SEARCH_RESPONSE_EVENT, { results, searchbox });
      })
      .catch((e) => {
        this.core[this.eventsPluginName].dispatchEvent(SEARCH_ERROR_EVENT, e);
      });
  }

  /**
   * Sends a search request using the GroupBy API.
   *
   * @param query the query to send.
   */
  sendSearchApiRequest(query: string): Promise<Results> {
    const fullQuery = { ...this.defaultSearchConfig, query };
    return this.core.search.search(fullQuery);
  }
}

/**
 * The type of the search request event payload. The payload is the
 * search term.
 */
export interface SearchRequestPayload {
  value: string;
  searchbox?: string;
}
