import { Plugin, PluginMetadata, PluginRegistry } from '@groupby/elements-core';
import { BEACON_SEARCH, BeaconSearchPayload } from '@groupby/elements-events';
// eslint-disable-next-line import/no-unresolved
import { AutoSearchEvent } from 'gb-tracker-client/models';
// eslint-disable-next-line import/no-unresolved
import { GbTracker } from 'gb-tracker-client/slim-es';

/**
 * This plugin is responsible for exposing a [[GbTracker]] instance to Core.
 * It listens for generic beacon events and triggers GroupBy-specific beacons.
 */
export default class GbTrackerPlugin implements Plugin {
  get metadata(): PluginMetadata {
    return {
      name: 'gb_tracker',
      depends: ['dom_events'],
    };
  }

  /**
   * The value that the [[GbTrackerPlugin]] exposes to the Core entity.
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
   * The [[GbTrackerPlugin]] constructor instantiates an instance of the
   * [[GbTracker]] client and attaches it to this plugin's `gbTracker`
   * property.
   *
   * @param _namedParameters The options for instantiating the [[GbTracker]] client.
   */
  constructor({
    /** The ID of the client. */
    customerId,
    /** The area in which the tracked actions will occur. */
    area,
  }: Partial<GbTrackerPluginOptions> = {}) {
    this.triggerSearchBeacon = this.triggerSearchBeacon.bind(this);

    this.gbTracker = new GbTracker(customerId, area);
    this.gbTracker.autoSetVisitor();
  }

  /**
   * Returns this plugin's instance of the [[GbTracker]] client.
   */
  register(plugins: PluginRegistry): ReturnType<typeof GbTracker> {
    this.core = plugins;
    return this.gbTracker;
  }

  /**
   * Sets event listeners for beacon events.
   */
  ready(): void {
    this.core[this.eventsPluginName].registerListener(BEACON_SEARCH, this.triggerSearchBeacon);
  }

  /**
   * Unregister event listeners for beacon events.
   */
  unregister(): void {
    this.core[this.eventsPluginName].unregisterListener(BEACON_SEARCH, this.triggerSearchBeacon);
  }

  /**
   * Triggers a Search beacon. Intended for use as an event listener.
   *
   * @param event The event containing search tracking data.
   */
  triggerSearchBeacon(event: CustomEvent<BeaconSearchPayload>): void {
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
export interface GbTrackerPluginOptions {
  /** The ID of the client. */
  customerId: string;
  /** The area in which the tracked actions will occur. */
  area?: string;
}
