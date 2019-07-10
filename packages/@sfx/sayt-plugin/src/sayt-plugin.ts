import { Plugin, PluginRegistry, PluginMetadata } from '@sfx/core';
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
   * The sayt property is the value that the Sayt Plugin
   * exposes to the Core entity.
   */
  sayt: Sayt;
  /**
   * The sayt plugin constructor function can take in optional options. It also instantiates
   * an instance of sayt, with any given options.
   * @param options an object that should contain subdomain and collection properties to
   * create a valid sayt request.
   */
  constructor(options?: SaytConfig) {
    this.sayt = new Sayt(options);
  }
  /**
   * The register method returns the instance of sayt.
   */
  register(): Sayt {
    return this.sayt;
  }
}
