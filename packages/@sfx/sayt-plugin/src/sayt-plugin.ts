import { Plugin, PluginRegistry, PluginMetadata } from '@sfx/core';
import { Sayt, SaytConfig } from 'sayt';

export default class SaytPlugin implements Plugin {
  get metadata(): PluginMetadata {
    return {
      name: 'sayt',
      depends: [],
    };
  }

  sayt: Sayt;

  constructor(options?: SaytConfig) {
    this.sayt = new Sayt(options);
  }

  register() {
    return this.sayt;
  }
}
