// eslint-disable-next-line import/no-extraneous-dependencies
import { PluginMetadata } from '@sfx/core';

/**
 * The SF-X cache plugin. This plugin registers an instance of `Map` that
 * is intended to be used by other plugins as a cache or other data
 * store. No automatic cache clearing or expiring is performed.
 */
export default class CachePlugin {
  get metadata(): PluginMetadata {
    return {
      name: 'cache',
      depends: [],
    };
  }
}
