// eslint-disable-next-line import/no-extraneous-dependencies, import/no-unresolved
import { Plugin, PluginMetadata } from '@groupby/elements-core';

/**
 * The GroupBy Elements cache plugin. This plugin registers an instance of
 * `Map` that is intended to be used by other plugins as a cache or other data
 * store. No automatic cache clearing or expiring is performed.
 */
export default class CachePlugin implements Plugin {
  get metadata(): PluginMetadata {
    return {
      name: 'cache',
      depends: [],
    };
  }

  /**
   * The data store in which cache entries are stored.
   */
  store: Map<unknown, unknown>;

  /**
   * Instantiates this plugin. By default, an empty `Map` is created as
   * the data store.
   *
   * @param __namedParameters Options for plugin configuration.
   */
  constructor({
    /**
     * The store to initialize the plugin with.
     * Defaults to an empty `Map`.
     */
    store = new Map(),
  }: Partial<CachePluginOptions> = {}) {
    this.store = store;
  }

  /**
   * Returns this plugin's store for registration.
   *
   * @returns [[store]]
   */
  register(): Map<unknown, unknown> {
    return this.store;
  }
}

/**
 * The type of the [[CachePlugin]] options object.
 */
export interface CachePluginOptions {
  /** The store with which to initialize the plugin. */
  store: Map<unknown, unknown>;
}
