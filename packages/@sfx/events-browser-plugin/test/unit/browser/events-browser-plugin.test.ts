import { expect, sinon, spy, stub } from '../../utils';
import EventsBrowserPlugin from '../../../src/events-browser-plugin';

describe('EventsBrowserPlugin', () => {
  let eventsBrowserPlugin: any;

  beforeEach(() => {
    eventsBrowserPlugin = new EventsBrowserPlugin();
  });

  describe('constructor()', () => {
    it('should create an EventsBrowserPlugin with default options', () => {
      const defaultOptions = { window: window, };

      expect(eventsBrowserPlugin.options).to.deep.equal(defaultOptions);
    });

    it('should combine default options and provided options', () => {
      const defaultOptions = { window: window, };
      const options: any = { a: 'b', c: 'd', };

      eventsBrowserPlugin = new EventsBrowserPlugin(options);

      expect(eventsBrowserPlugin.options).to.deep.equal({ ...defaultOptions, ...options });
    });

    it('should override default options', () => {
      const options: any = {
        foo: 'bar',
        baz: 'qux',
        window: {
          windowProp: 'windowPropValue',
        },
      };
      eventsBrowserPlugin = new EventsBrowserPlugin(options);

      expect(eventsBrowserPlugin.window).to.deep.equal(options.window);
    });
  });

  describe('register()', () => {
    it('should return an exposedValue', () => {
      const pluginRegistry = { dummyPlugin: 'b' };
      const exposedValue = {
        registerListener: eventsBrowserPlugin.registerListener,
        unregisterListener: eventsBrowserPlugin.unregisterListener,
        dispatchEvent: eventsBrowserPlugin.dispatchEvent,
      };

      const registerReturnValue = eventsBrowserPlugin.register(pluginRegistry);

      expect(registerReturnValue).to.deep.equal(exposedValue);
    });
  });

  describe('registerListener()', () => {
    it('should call addEventListener with eventName and callback', () => {
      const eventName = 'fetchProducts';
      const callback = () => null;
      const addEventListener = stub(eventsBrowserPlugin.window, 'addEventListener');

      eventsBrowserPlugin.registerListener(eventName, callback);

      expect(addEventListener).to.be.calledWith(eventName, callback);
    });
  });

  describe('unregisterListen()', () => {
    it('should call removeEventListener with eventName and callback', () => {
      const eventName = 'fetchProducts';
      const callback = () => null;
      const removeEventListener = stub(eventsBrowserPlugin.window, 'removeEventListener');

      eventsBrowserPlugin.unregisterListener(eventName, callback);

      expect(removeEventListener).to.be.calledWith(eventName, callback);
    });
  });

  describe('dispatchEvent()', () => {
    it('should call dispatch with eventName and payload', () => {
      const eventName = 'fetchProducts';
      const payload = { a: 'b' };
      const dispatchEvent = stub(eventsBrowserPlugin.window, 'dispatchEvent');
      const eventToDispatch = new eventsBrowserPlugin.window.CustomEvent(eventName, { detail: payload });

      eventsBrowserPlugin.dispatchEvent(eventName, payload);

      expect(dispatchEvent).to.be.calledWith(eventToDispatch);
    });
  });
});
