import { Plugin, PluginRegistry, PluginMetadata } from '@sfx/core';
/**
 * The browser version of the events plugin designed for the SF-X product.
 * This plugin is responsible for exposing methods that will allow other
 * plugins to register, unregister, and dispatch events.
 */
export default class EventsBrowserPlugin implements Plugin {
  get metadata(): PluginMetadata {
    return {
      name: 'events-browser-plugin',
      depends: [],
    };
  }

  /**
   * The core property is meant to hold a reference to the plugin registry
   * that is passed in during the plugin registration lifecycle event.
   */
  core: PluginRegistry;
  /**
   * The exposedValue property is the value that the Events Browser Plugin
   * exposes to the Core entity.
   */
  exposedValue: EventsBrowserPluginExposedValue;
  /**
   * The options property is the set of configuration values used to set
   * up the plugin during construction.
   */
  options: EventsBrowserPluginOptions = {
    window: typeof window !== "undefined" ? window : undefined,
    CustomEvent: typeof CustomEvent !== "undefined" ? CustomEvent : undefined,
  };
  window: Window;
  CustomEvent: typeof CustomEvent;

  /**
   * The browser events plugin constructor function which will combine
   * both the default options and any options passed in. Also the constructor
   * will accept a window object and a CustomEvent constructor provided
   * through the options object.
   *
   * If either the window object or CustomEvent constructor provided are
   * not valid, the plugin constructor will throw an error.
   *
   * @param options an object that must contain a window property that is
   * a reference to the browser Window object.
   */
  constructor(options: Partial<EventsBrowserPluginOptions> = {}) {
    this.options = {...this.options, ...options};
    this.window = this.options.window;
    this.CustomEvent = this.options.CustomEvent;

    if (!this.window) {
      throw new Error('window object is not valid');
    }

    if (typeof this.CustomEvent !== 'function') {
      throw new Error('CustomEvent constructor is not valid');
    }

    // Binds
    this.registerListener = this.registerListener.bind(this);
    this.unregisterListener = this.unregisterListener.bind(this);
    this.dispatchEvent = this.dispatchEvent.bind(this);
  }

  /**
   * The register method that accepts a plugin registry object and returns
   * the exposedValue of the browser events plugin. The exposedValue is an
   * object that holds references to the registerListener, unregisterListener,
   * and dispatchEvent methods.
   *
   * @param plugins a plugin registry object.
   */
  register(plugins: PluginRegistry): EventsBrowserPluginExposedValue {
    this.core = plugins;

    this.exposedValue = {
      registerListener: this.registerListener,
      unregisterListener: this.unregisterListener,
      dispatchEvent: this.dispatchEvent,
    };

    return this.exposedValue;
  }

  /**
   * Register an event listener for a given event and a callback to be
   * invoked in response to the same event.
   *
   * @param eventName Name of the event to be registered/listened for.
   * @param callback Callback to be registered with the listener.
   */
  registerListener(eventName: string, callback: EventListener) {
    this.window.addEventListener(eventName, callback);
  }

  /**
   * Unregister/remove an event listener for the given event as well as
   * its corresponding callback function.
   *
   * @param eventName Name of the event to unregister.
   * @param callback Callback to be unregistered along with the event.
   */
  unregisterListener(eventName: string, callback: EventListener) {
    this.window.removeEventListener(eventName, callback);
  }

  /**
   * Dispatch a given event and provide a payload which will be received
   * by a listener registered for the given event.
   *
   * @param eventName Name of the event to be dispatched.
   * @param payload Data to accompany the dispatched event.
   */
  dispatchEvent(eventName: string, payload?: any) {
    const eventToDispatch = new this.CustomEvent(eventName, { detail: payload });

    this.window.dispatchEvent(eventToDispatch);
  }
 }

/**
 * Browser Events Plugin options. This plugin expects a reference to a window
 * object be provided that conforms to the Window type.
 */
export interface EventsBrowserPluginOptions {
  window: Window,
  CustomEvent: typeof CustomEvent,
}

/**
 * Browser Events Plugin exposed value. This plugin will return an object
 * of the outlined shape during the plugin registration lifecycle.
 */
export interface EventsBrowserPluginExposedValue {
  registerListener: (eventName: string, callback: EventListener) => void,
  unregisterListener: (eventName: string, callback: EventListener) => void,
  dispatchEvent: (eventName: string, payload?: any) => void,
}
