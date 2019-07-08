import { Plugin, PluginRegistry, PluginMetadata } from '@sfx/core';
import { Sayt } from 'sayt';

export default class SaytPlugin implements Plugin {
  get metadata(): PluginMetadata {
    return {
      name: 'sayt-plugin',
      depends: [],
    };
  }

  core: PluginRegistry;
  exposedValue: SaytPluginExposedValue;

  getSayt(clientTarget) {
    let config = {
      https: true,
      collection: 'BCProduction',
      subdomain: clientTarget,
    };

    return new Sayt(config);
  }

  register(plugins: PluginRegistry): SaytPluginExposedValue {
    this.core = plugins;

    this.exposedValue = {
      getSayt: this.getSayt,
    };

    return this.exposedValue;
  }
}

export interface SaytPluginExposedValue {
  getSayt: (clientTarget: string) => Sayt;
}
