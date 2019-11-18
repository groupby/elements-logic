// eslint-disable-next-line import/no-extraneous-dependencies, import/no-unresolved
import { Plugin, PluginMetadata, PluginRegistry } from '@groupby/elements-core';
// import * as GbTracker from 'gb-tracker-client';
import { GbTracker } from 'gb-tracker-client/slim-es';

/**
 * This plugin is responsible for exposing an instance of sayt
 * to Core.
 */
export default class GbTrackerPlugin implements Plugin {
  get metadata(): PluginMetadata {
    return {
      name: 'gb-tracker',
      depends: ['dom_events'],
    };
  }

  /**
   * The value that the Sayt plugin exposes to the Core entity.
   */
  gbTracker: ReturnType<typeof GbTracker>;

  /**
   * A reference to the registry of plugins for later use.
   */
  core: PluginRegistry;

  /**
   * Name of the events plugin.
   */
  eventsPluginName = 'dom_events';

  /**
   * The sayt plugin constructor instantiates an instance of the sayt plugin
   * and attaches it to this plugin's sayt property.
   *
   * @param options The options to instantiate the sayt client with.
   */
  constructor(options: TrackerPluginOptions) {
    // @TODO Add options if necessary. Should have intelligent defaults.
    this.gbTracker = new GbTracker(options.customerId, options.area, options.overridePixelUrl);
  }

  /**
   * Returns this plugin's instance of the sayt client.
   */
  register(plugins: PluginRegistry): ReturnType<typeof GbTracker> {
    this.core = plugins;
    return this.gbTracker;
  }

  /**
   * Sets event listeners for tracker events.
   */
  ready() {
    this.core[this.eventsPluginName].registerListener(TrackerSearchEvent, this.triggerSearchBeacon);
    this.core[this.eventsPluginName].registerListener(TrackerSaytEvent, this.triggerSaytBeacon);
  }

  /**
   * Triggers a Search beacon.
   */
  triggerSearchBeacon() {
    // @TODO Fill this in.
  }

  /**
   * Triggers a Sayt beacon.
   */
  triggerSaytBeacon() {
    // @TODO Fill this in.
  }
}

export interface TrackerPluginOptions {
  customerId: string;
  area?: string;
  overridePixelUrl?: string;
}

export const TrackerSearchEvent: string = 'gbe::tracker::search';
export const TrackerSaytEvent: string = 'gbe::tracker::sayt';
