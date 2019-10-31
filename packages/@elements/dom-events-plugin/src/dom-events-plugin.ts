// eslint-disable-next-line import/no-extraneous-dependencies, import/no-unresolved
import { Plugin, PluginRegistry, PluginMetadata } from '@elements/core';

/**
 * The browser version of the events plugin designed for the SF-X product.
 * This plugin is responsible for exposing methods that will allow other
 * plugins to register, unregister, and dispatch events.
 */
export default class DomEventsPlugin implements Plugin {
  get metadata(): PluginMetadata {
    return {
      name: 'dom_events',
      depends: [],
    };
  }

  /**
   * Holds a reference to the plugin registry that is passed in during the
   * plugin registration lifecycle event.
   */
  core: PluginRegistry;

  /**
   * Value that the DOM Events Plugin exposes to the Core entity.
   */
  exposedValue: DomEventsPluginExposedValue;

  /**
   * Configuration values used to set up the plugin during construction.
   */
  options: DomEventsPluginOptions = {
    window: typeof window !== 'undefined' ? window : undefined,
    CustomEvent: typeof CustomEvent !== 'undefined' ? CustomEvent : undefined,
  };

  /**
   * Holds a reference to the `window` object, which will be used to invoke
   * various window methods.
   */
  window: Window;

  /**
   * Holds a reference to the `CustomEvent` constructor, which will be
   * used to dispatch custom events.
   */
  CustomEvent: typeof CustomEvent;

  /**
   * The DOM events plugin constructor function which will combine
   * both the default options and any options passed in.
   *
   * If either the `window` object or `CustomEvent` constructor provided
   * are not valid, the plugin constructor will throw an error.
   *
   * @param options an options object that will be used to configure the
   * plugin.
   */
  constructor(options: Partial<DomEventsPluginOptions> = {}) {
    this.options = { ...this.options, ...options };
    this.window = this.options.window;
    this.CustomEvent = this.options.CustomEvent;

    if (!this.window) {
      throw new Error('window object is not valid');
    }

    if (typeof this.CustomEvent !== 'function') {
      throw new Error('CustomEvent constructor is not valid');
    }

    this.registerListener = this.registerListener.bind(this);
    this.unregisterListener = this.unregisterListener.bind(this);
    this.dispatchEvent = this.dispatchEvent.bind(this);
  }

  /**
   * Method to be invoked during the registration step of the plugin lifecycle.
   * The method returns the exposedValue of the DOM events plugin.
   * The exposedValue is an object that holds references to the
   * registerListener, unregisterListener, and dispatchEvent methods.
   *
   * @param plugins a plugin registry object.
   */
  register(plugins: PluginRegistry): DomEventsPluginExposedValue {
    this.core = plugins;

    this.exposedValue = {
      registerListener: this.registerListener,
      unregisterListener: this.unregisterListener,
      dispatchEvent: this.dispatchEvent,
    };

    return this.exposedValue;
  }

  /**
    * @see [[DomEventsPluginExposedValue.registerListener]]
   */
  registerListener(eventName: string, callback: EventListener): void {
    this.window.addEventListener(eventName, callback);
  }

  /**
   * @see [[DomEventsPluginExposedValue.unregisterListener]]
   */
  unregisterListener(eventName: string, callback: EventListener): void {
    this.window.removeEventListener(eventName, callback);
  }

  /**
   * @see [[DomEventsPluginExposedValue.dispatchEvent]]
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatchEvent<T = any>(eventName: string, payload?: T): void {
    const eventToDispatch = new this.CustomEvent<T>(eventName, { detail: payload });
    this.window.dispatchEvent(eventToDispatch);
  }
}

/**
 * DOM Events Plugin options.
 */
export interface DomEventsPluginOptions {
  /**
   * Will be used to invoke event-related methods to add/remove listeners
   * and dispatch events.
   */
  window: Window;
  /**
   * Will be used to create custom event objects.
   */
  CustomEvent: typeof CustomEvent;
}

/**
 * DOM Events Plugin exposed value. This plugin will return an object of
 * the outlined shape during the plugin registration lifecycle.
 */
export interface DomEventsPluginExposedValue {
  /**
   * Registers an event listener for a given event and a callback to be
   * invoked in response to the same event.
   *
   * @param eventName Name of the event to be registered/listened for.
   * @param callback Callback to be registered with the listener.
   */
  registerListener: (eventName: string, callback: EventListener) => void;
  /**
   * Unregisters an event listener for the given event as well as
   * its corresponding callback function.
   *
   * @param eventName Name of the event to unregister.
   * @param callback Callback to be unregistered along with the event.
   */
  unregisterListener: (eventName: string, callback: EventListener) => void;
  /**
   * Dispatches an event with the provided name and payload.
   *
   * @param eventName Name of the event to be dispatched.
   * @param payload Data to accompany the dispatched event.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatchEvent: (eventName: string, payload?: any) => void;
}
