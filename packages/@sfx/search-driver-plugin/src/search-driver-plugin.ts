import { Plugin, PluginRegistry, PluginMetadata } from '@sfx/core';
// import { Sayt, SaytConfig } from 'sayt';

/**
 * This plugin is responsible for exposing an instance of sayt
 * to Core.
 */
 export default class SearchDriverPlugin implements Plugin {
  get metadata(): PluginMetadata {
    return {
      name: 'search-driver',
      depends: [],
    };
  }

  /**
   * 
   */
  constructor() {
  }

  /**
   * 
   */
  register(): object {
    return {

    }
  }
}