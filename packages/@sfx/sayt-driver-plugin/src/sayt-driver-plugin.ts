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

  constructor() {
    this.fetchSaytData = this.fetchSaytData.bind(this);
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
   * Dispatches an event with the response from the sayt data plugin.
   * Callback for the Sayt data request event listener.
   *
   * @param saytDataQuery Request object received from the event listener.
   */
  fetchSaytData(saytDataQuery: QueryTimeAutocompleteConfigWithQuery): void {
    this.sendSaytApiRequest(saytDataQuery)
      .then((data) => {
        this.core[this.eventsPluginName].dispatchEvent(this.saytResponseEvent, data);
      })
      .catch((e) => {
        this.core[this.eventsPluginName].dispatchEvent(this.saytErrorEvent, e);
      });
  }

  /**
   * Sends a request to the SAYT API with the given query and config object.
   *
   * @param saytDataQuery Request object received from the event listener.
   * @returns A promise from the Sayt API that has been reformatted
   * with the passed callback.
   */
  sendSaytApiRequest({ query, ...config }: QueryTimeAutocompleteConfigWithQuery): Promise<string[]> {
    return this.core.sayt.autocomplete(query, config).then(this.autocompleteCallback);
  }

  /**
   * Extracts search terms from the given response.
   *
   * @param response An array search term strings.
   * @returns An array of search term strings.
   */
  autocompleteCallback(response: AutocompleteResponse): AutocompleteResponseSection[] {
    const searchTerms = {
      title: '',
      items: response.result.searchTerms
        ? this.constructSearchterms(response.result.searchTerms)
        : [],
    };
    return [searchTerms];
  }

  constructSearchterms(terms: AutocompleteSearchTerm[]): SearchTermItem[] {
    return terms.map((term) => {
      return { label: term.value };
    }).filter((item) => item.label);
  }
}

/**
 * The type of the sayt autocomplete request event payload.
 */
export interface QueryTimeAutocompleteConfigWithQuery extends QueryTimeAutocompleteConfig {
  query: string;
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
