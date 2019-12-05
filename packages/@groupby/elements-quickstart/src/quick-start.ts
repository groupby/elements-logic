import { CacheDriverPlugin } from '@groupby/elements-cache-driver-plugin';
import { CachePlugin, CachePluginOptions } from '@groupby/elements-cache-plugin';
import { Core } from '@groupby/elements-core';
import { DomEventsPlugin, DomEventsPluginOptions } from '@groupby/elements-dom-events-plugin';
import { ProductTransformer } from '@groupby/elements-events';
import { SaytDriverPlugin, SaytDriverOptions } from '@groupby/elements-sayt-driver-plugin';
import { SaytPlugin } from '@groupby/elements-sayt-plugin';
import { SearchDriverPlugin } from '@groupby/elements-search-driver-plugin';
import { SearchPlugin, SearchPluginOptions } from '@groupby/elements-search-plugin';
import { SaytConfig } from 'sayt';
import {  } from '@groupby/elements-sayt-driver-plugin/dist/sayt-driver-plugin';

export default function quickStart<P>({
  customerId,
  productTransformer,
  pluginOptions: {
    cache,
    dom_events,
    sayt,
    sayt_driver,
    search, 
  } = {},
}: QuickStartOptions<P>): Core {
  const core = new Core();
  const cacheDriverPlugin = new CacheDriverPlugin();
  const cachePlugin = new CachePlugin(cache);
  const domEventsPlugin = new DomEventsPlugin(dom_events);
  const saytDriverPlugin = new SaytDriverPlugin({ ...sayt_driver, productTransformer });
  const saytPlugin = new SaytPlugin({ ...sayt, subdomain: customerId });
  const searchDriverPlugin = new SearchDriverPlugin({ productTransformer });
  const searchPlugin = new SearchPlugin({ ...search, customerId });

  core.register([
    cacheDriverPlugin,
    cachePlugin,
    domEventsPlugin,
    saytDriverPlugin,
    saytPlugin,
    searchDriverPlugin,
    searchPlugin,
  ]);

  return core;
}

export interface QuickStartOptions<P> {
  customerId: string;
  productTransformer?: ProductTransformer<P>;
  pluginOptions?: {
    cache?: Partial<CachePluginOptions>;
    dom_events?: Partial<DomEventsPluginOptions>;
    sayt?: SaytConfig;
    sayt_driver?: Partial<SaytDriverOptions<P>>;
    search?: Partial<SearchPluginOptions>;
  }
}
