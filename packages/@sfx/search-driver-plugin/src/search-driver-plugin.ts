import { Plugin, PluginRegistry, PluginMetadata } from '@sfx/core';
import { Results, Request as SearchRequest } from '@sfx/search-plugin';
import {
  SEARCH_REQUEST,
  SEARCH_RESPONSE,
  SEARCH_ERROR,
  SearchRequestPayload,
  SearchResponsePayload,
  SearchErrorPayload,
} from '@sfx/events';

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
   * - [[SEARCH_REQUEST]]
   */
  ready() {
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
        const payload: SearchResponsePayload = { results, group };
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
  sendSearchApiRequest(query: string): Promise<Results> {
    const fullQuery = { ...this.defaultSearchConfig, query };
    return this.core.search.search(fullQuery);
  }
}
