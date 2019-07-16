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

  /**
   * Holds reference to the plugin registry that is received in registration.
   */
  core: PluginRegistry;
  /**
   * Name of the events plugin.
   */
  eventsPluginName: string = 'dom_events';
  /**
   * Event names for listening and dispatching.
   */
  saytDataEvent: string = 'sfx::fetch_autocomplete_data';
  saytResponseEvent: string = 'sfx::autocomplete_received_results';
  saytErrorEvent: string = 'sfx::autocomplete_sayt_error';

  constructor() {
    this.fetchSaytData = this.fetchSaytData.bind(this);
  }

  /**
   * Callback method for when the plugin is registered in Core.
   * The method will set the plugin registry to the plugin's internal 'core' property.
   *
   * @param plugins The plugin registry object from Core.
   */
  register(plugins: PluginRegistry): void {
    this.core = plugins;
  }

  /**
   * Lifecycle event where the plugin can first safely interact with the registry.
   * The method will register an event listener for listening to Sayt data requests
   * and trigger its callback for making search requests.
   */
  ready(): void {
    this.core[this.eventsPluginName].registerListener(this.saytDataEvent, this.fetchSaytData);
  }

  /**
   * Lifecycle event where the plugin will unregister all event listeners.
   */
  unregister(): void {
    this.core[this.eventsPluginName].unregisterListener(this.saytDataEvent, this.fetchSaytData);
  }

  /**
   * Callback for the Sayt data request event listener.
   * Dispatches an event with the response from the sayt data plugin.
   *
   * @param saytDataQuery Request object received from the event listener.
   */
  fetchSaytData(saytDataQuery: SaytDataPayload): void {
    const response = this.sendSaytAPIRequest(saytDataQuery);
    response.then((data: any) => {
      this.core[this.eventsPluginName].dispatchEvent(this.saytResponseEvent, data);
    })
    .catch((e) => {
      this.core[this.eventsPluginName].dispatchEvent(this.saytErrorEvent, e);
    });
  }

  /**
   * Splits the request payload into the query string and a config object.
   * Sends a search request to the sayt data plugin.
   *
   * @param saytDataQuery Request object received from the event listener.
   * @returns A promise from the Sayt API that has been reformatted with a callback.
   */
  sendSaytAPIRequest(saytDataQuery: SaytDataPayload): Promise<string[]> {
    const { query, ...config } = saytDataQuery;
    return this.core.sayt.autocomplete(query, config, this.autocompleteCallback);
  }

  /**
   * Callback for the Sayt client to transform the search response into
   * relevant information.
   *
   * @param x Sayt client requires a placeholder attribute as the first argument
   * for any callback passed to it.
   * @param response An array search term strings.
   */
  autocompleteCallback(x: undefined, response: any): string[] {
    return response.result.searchTerms.map((term: any) => {
      return term.value;
    });
  }
}

/**
 * Interface from the Sayt client for how the search config should be shaped.
 */
interface SaytDataPayload {
  query: string;
  collection?: string;
  language?: string;
  numSearchTerms?: number;
  numNavigations?: number;
  sortAlphabetically?: boolean;
  fuzzyMatch?: boolean;
};
