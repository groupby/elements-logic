import { Plugin, PluginMetadata } from '@groupby/elements-core';
import { Sayt, SaytConfig } from 'sayt';

/**
 * This plugin is responsible for exposing an instance of sayt
 * to Core.
 */
export default class SaytPlugin implements Plugin {
  get metadata(): PluginMetadata {
    return {
      name: 'sayt',
      depends: [],
    };
  }

  /**
   * The value that the Sayt plugin exposes to the Core entity.
   */
  sayt: Sayt;

  /**
   * The sayt plugin constructor instantiates an instance of the sayt plugin
   * and attaches it to this plugin's sayt property.
   *
   * @param options The options to instantiate the sayt client with.
   */
  constructor(options?: SaytOptions) {
    this.sayt = new Sayt(options);
  }

  /**
   * Returns this plugin's instance of the sayt client.
   */
  register(): Sayt {
    return this.sayt;
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SaytOptions extends SaytConfig {}
