/* eslint-disable @typescript-eslint/camelcase, camelcase */

import { CacheDriverPlugin, CacheDriverOptions } from '@groupby/elements-cache-driver-plugin';
import { CachePlugin, CachePluginOptions } from '@groupby/elements-cache-plugin';
import { Core } from '@groupby/elements-core';
import { DomEventsPlugin, DomEventsPluginOptions } from '@groupby/elements-dom-events-plugin';
// eslint-disable-next-line import/no-extraneous-dependencies
import { GbTrackerPlugin, GbTrackerPluginOptions } from '@groupby/elements-gb-tracker-plugin';
import { ProductTransformer } from '@groupby/elements-events';
import { SaytDriverPlugin, SaytDriverOptions } from '@groupby/elements-sayt-driver-plugin';
import { SaytPlugin, SaytPluginOptions } from '@groupby/elements-sayt-plugin';
import { SearchDriverPlugin, SearchDriverOptions } from '@groupby/elements-search-driver-plugin';
import { SearchPlugin, SearchPluginOptions } from '@groupby/elements-search-plugin';

/**
 * The GroupBy Elements quick start function.
 * This function instantiates [[Core]] and registers a number of plugins.
 *
 * The plugins included are:
 * - `cache`
 * - `cache_driver
 * - `dom_events`
 * - `gb_tracker`
 * - `sayt`
 * - `sayt_driver`
 * - `search`
 * - `search_driver`
 *
 * @param __namedParameters Options for plugin configuration.
 * @returns An instance of Core with the above plugins configured and registered.
 */
export default function quickStart<P>({
  /** The GroupBy customer ID to use. */
  customerId,
  /**
   * The function to use to transform a GroupBy Search API Record
   * into an Elements Product.
   */
  productTransformer,
  /**
   * Options to configure individual plugins.
   * All keys are optional.
   */
  pluginOptions: {
    /** Options for the Cache plugin. */
    cache,
    /** Options for the Cache Driver plugin. */
    cache_driver,
    /** Options for the DOM Events plugin. */
    dom_events,
    /** Options for the GB Tracker plugin. */
    gb_tracker,
    /** Options for the SAYT plugin. */
    sayt,
    /** Options for the SAYT Driver plugin. */
    sayt_driver,
    /** Options for the Search plugin. */
    search,
    /** Options for the Search Driver plugin. */
    search_driver,
  } = {},
}: QuickStartOptions<P>): Core {
  const wrappedProductTransformer = productTransformer ? { productTransformer } : {};
  const core = new Core();
  const cacheDriverPlugin = new CacheDriverPlugin(cache_driver);
  const cachePlugin = new CachePlugin(cache);
  const domEventsPlugin = new DomEventsPlugin(dom_events);
  const gbTrackerPlugin = new GbTrackerPlugin({ customerId, ...gb_tracker });
  const saytDriverPlugin = new SaytDriverPlugin({ ...wrappedProductTransformer, ...sayt_driver });
  const saytPlugin = new SaytPlugin({ subdomain: customerId, ...sayt });
  const searchDriverPlugin = new SearchDriverPlugin({ ...wrappedProductTransformer, ...search_driver });
  const searchPlugin = new SearchPlugin({ customerId, ...search });

  core.register([
    cacheDriverPlugin,
    cachePlugin,
    domEventsPlugin,
    gbTrackerPlugin,
    saytDriverPlugin,
    saytPlugin,
    searchDriverPlugin,
    searchPlugin,
  ]);

  return core;
}

/**
 * Options for the quick start function.
 */
export interface QuickStartOptions<P> {
  /** The GroupBy customer ID to pass to use. */
  customerId: string;
  /**
   * The function to use to transform a GroupBy Search API Record
   * into an Elements Product.
   */
  productTransformer?: ProductTransformer<P>;
  /** Options to configure individual plugins. */
  pluginOptions?: {
    /** Options for the Cache plugin. */
    cache?: Partial<CachePluginOptions>;
    /** Options for the Cache Driver plugin. */
    cache_driver?: Partial<CacheDriverOptions>;
    /** Options for the DOM Events plugin. */
    dom_events?: Partial<DomEventsPluginOptions>;
    /** Options for the GB Tracker plugin. */
    gb_tracker?: Partial<GbTrackerPluginOptions>;
    /** Options for the SAYT plugin. */
    sayt?: Partial<SaytPluginOptions>;
    /** Options for the SAYT Driver plugin. */
    sayt_driver?: Partial<SaytDriverOptions<P>>;
    /** Options for the Search plugin. */
    search?: Partial<SearchPluginOptions>;
    /** Options for the Search Driver plugin. */
    search_driver?: Partial<SearchDriverOptions<P>>;
  };
}
