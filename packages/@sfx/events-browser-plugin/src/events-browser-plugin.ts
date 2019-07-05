/*
 This is the events plugin designed for a browser based environment
 It needs to include the following methods:
  Listen (aka a register listener method).
     The listen method should accept the following parameters:
      type: this parameter informs the method of the event that needs to be listened for.
      name: An alternative parameter to type, it informs the method of the name of the event.
      callback: This is a function that informs the listen method what should be registered to be invoked in response to "hearing" the provided event.
  Unlisten (aka an unregister listener method).
    The unlisten method should accept the following parameters:
      type: this parameter informs the method of event needs to be unregistered.
      name: An alternative parameter to type, it informs the method of the name of the event to unregister.
      callback: This is the event handler function that was meant to handle the event that is being removed.
  Dispatch (aka an event dispatching method).
    The dispatch method should accept the following parameters:
      type: this parameter informs the method of the event that needs to be dispatched.
      name: An alternative parameter to type, it informs the method of the name of the event.
      payload: The information meant to be sent along with the event that is being dispatched.
    Note: the Dispatch method will be dispatching customEvents in order to attach custom data to any given event.
*/
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
  };
  window: any;

  /**
   * The browser events plugin constructor function which will combine
   * both the default options and any options passed in. Also the constructor
   * will accept a window object provided through the options object.
   * If the window object provided is not valid, the constructor will throw
   * an error.
   * @param options an object that must contain a window property that is
   * a reference to the browser Window object.
   */
  constructor(options: Partial<EventsBrowserPluginOptions> = {}) {
    this.options = {...this.options, ...options};
    this.window = this.options.window;

    if(!this.window) {
      throw new Error('window object is not valid');
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

  registerListener(eventName: string, callback: EventListener) {
    this.window.addEventListener(eventName, callback);
  }

  unregisterListener(eventName: string, callback: EventListener) {
    this.window.removeEventListener(eventName, callback);
  }

  dispatchEvent(eventName: string, payload?: any) {
    const eventToDispatch = new this.window.CustomEvent(eventName, { detail: payload });

    this.window.dispatchEvent(eventToDispatch);
  }
 }

// Interfaces
export interface EventsBrowserPluginOptions {
  window: Window,
}

export interface EventsBrowserPluginExposedValue {
  registerListener: (eventName: string, callback: EventListener) => void,
  unregisterListener: (eventName: string, callback: EventListener) => void,
  dispatchEvent: (eventName: string, payload?: any) => void,
}
