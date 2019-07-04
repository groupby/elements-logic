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
import { Plugin, PluginRegistry, PluginMetadata } from '../../core/src/plugin';

 export default class EventsBrowserPlugin implements Plugin {
  get metadata(): PluginMetadata {
    return {
      name: 'events-browser-plugin',
      depends: [],
    };
  }

  // Plugin Properties
  core: object;
  exposedValue: any;
  options: EventsBrowserPluginOptions = {
    window: typeof window !== "undefined" ? window : undefined,
  };
  window: any;

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

  register(plugins: PluginRegistry) {
    this.core = plugins;

    this.exposedValue = {
      registerListener: this.registerListener,
      unregisterListener: this.unregisterListener,
      dispatchEvent: this.dispatchEvent,
    };

    return this.exposedValue;
  }

  registerListener(eventName: string, callback: () => void) {
    this.window.addEventListener(eventName, callback);
  }

  unregisterListener() {
    console.log('Unlistening method has fired');
  }

  dispatchEvent() {
    console.log('Dispatch method has fired');
  }
 }

// Interfaces
export interface EventsBrowserPluginOptions {
  window: Window,
}
