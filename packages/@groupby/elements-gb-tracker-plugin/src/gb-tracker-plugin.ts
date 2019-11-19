// eslint-disable-next-line import/no-extraneous-dependencies, import/no-unresolved
import { Plugin, PluginMetadata, PluginRegistry } from '@groupby/elements-core';
// eslint-disable-next-line import/no-unresolved
import { GbTracker } from 'gb-tracker-client/slim-es';
// eslint-disable-next-line import/no-unresolved
import { AutoSearchEvent, SendableOrigin } from 'gb-tracker-client/models';
import { Results } from 'groupby-api';

/** The event to trigger a search beacon. */
export const TRACKER_SEARCH: string = 'gbe::tracker::search';

/**
 * The type of the [[TRACKER_SEARCH]] event payload.
 */
export interface TrackerSearchPayload {
  /** The search results. */
  results: Results;
  /** The origin of the search action. */
  origin: SendableOrigin;
}

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
  ready(): void {
    this.core[this.eventsPluginName].registerListener(TRACKER_SEARCH, this.triggerSearchBeacon);
  }

  /**
   * Unregister event listeners for tracker events.
   */
  unregister(): void {
    this.core[this.eventsPluginName].unregisterListener(TRACKER_SEARCH, this.triggerSearchBeacon);
  }

  /**
   * Triggers a Search beacon.
   * Assumes a search results payload is sent along with an origin.
   *
   * @param event The event containing search tracking data.
   */
  triggerSearchBeacon(event: CustomEvent<TrackerSearchPayload>): void {
    const payload: AutoSearchEvent = {
      search: {
        id: event.detail.results.id,
        origin: event.detail.origin,
      },
    };
    this.gbTracker.sendAutoSearchEvent(payload);
  }
}

/**
 * The options used to instantiate a [[GbTrackerPlugin]].
 */
export interface TrackerPluginOptions {
  /** The ID of the client. */
  customerId: string;
  /** The area in which the tracked actions will occur. */
  area?: string;
  // @TODO Is this option needed? What does it do?
  overridePixelUrl?: string;
}
