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
import { Plugin } from '../../core/src/plugin';

 export default class EventsBrowserPlugin implements Plugin {
  get metadata() {
    return {
      name: 'events-browser-plugin',
      depends: [],
    };
  }

  // Plugin Properties
  core: object;
  exposedValue: any;
  options: any = {};
  window: any;

  constructor(options: any) {
    this.options = {...this.options, ...options};
    this.window = this.options.window || window;

    // Binds
    this.listen = this.listen.bind(this);
    this.unlisten = this.listen.bind(this);
    this.dispatch = this.dispatch.bind(this);
  }

  register(plugins) {
    this.core = plugins;

    this.exposedValue = {
      listen: this.listen,
      unlisten: this.unlisten,
      dispatch: this.dispatch,
    };

    return this.exposedValue;
  }

  init() {}

  ready() {}

  listen() {
    console.log('Listening method has fired');
  }

  unlisten() {
    console.log('Unlistening method has fired');
  }

  dispatch() {
    console.log('Dispatch method has fired');
  }
 }

// Interfaces
