import { CacheDriverPlugin } from '@groupby/elements-cache-driver-plugin';
import { CachePlugin } from '@groupby/elements-cache-plugin';
import { Core } from '@groupby/elements-core';
import { DomEventsPlugin } from '@groupby/elements-dom-events-plugin';
import { SaytDriverPlugin } from '@groupby/elements-sayt-driver-plugin';
import { SaytPlugin } from '@groupby/elements-sayt-plugin';
import { SearchDriverPlugin } from '@groupby/elements-search-driver-plugin';
import { SearchPlugin } from '@groupby/elements-search-plugin';

export default function quickStart({ customerId }: QuickStartOptions): Core {
  const core = new Core();
  const cacheDriverPlugin = new CacheDriverPlugin();
  const cachePlugin = new CachePlugin();
  const domEventsPlugin = new DomEventsPlugin();
  const saytDriverPlugin = new SaytDriverPlugin();
  const saytPlugin = new SaytPlugin({ subdomain: customerId });
  const searchDriverPlugin = new SearchDriverPlugin();
  const searchPlugin = new SearchPlugin({} as any);

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

export interface QuickStartOptions {
  customerId: string;
}
