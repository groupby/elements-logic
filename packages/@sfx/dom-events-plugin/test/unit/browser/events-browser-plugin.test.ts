import { expect, sinon, spy, stub } from '../../utils';
import DomEventsPlugin from '../../../src/dom-events-plugin';

describe('domEventsPlugin', () => {
  let domEventsPlugin: any;

  beforeEach(() => {
    domEventsPlugin = new DomEventsPlugin();
  });

  describe('constructor()', () => {
    it('should create a DomEventsPlugin instance with default options', () => {
      const defaultOptions = { window: window, CustomEvent: CustomEvent };

      expect(domEventsPlugin.options).to.deep.equal(defaultOptions);
    });

    it('should throw an error if an invalid window option is provided', () => {
      const invalidOptions = {
        window: undefined,
        CustomEvent: CustomEvent,
      };

      expect(() => new DomEventsPlugin(invalidOptions)).to.throw();
    });

    it('should throw an error if an invalid CustomEvent constructor is provided', () => {
      const invalidOptions = {
        windowL: Window,
        CustomEvent: undefined,
      };

      expect(() => new DomEventsPlugin(invalidOptions)).to.throw();
    });

    it('should combine default options and provided options', () => {
      const defaultOptions = { window: window, CustomEvent: CustomEvent };
      const options: any = { a: 'b', c: 'd', };

      domEventsPlugin = new DomEventsPlugin(options);

      expect(domEventsPlugin.options).to.deep.equal({ ...defaultOptions, ...options });
    });

    it('should override default options', () => {
      const options: any = {
        foo: 'bar',
        baz: 'qux',
        window: {
          windowProp: 'windowPropValue',
        },
      };
      domEventsPlugin = new DomEventsPlugin(options);

      expect(domEventsPlugin.window).to.deep.equal(options.window);
    });
  });

  describe('register()', () => {
    it('should return an exposedValue', () => {
      const pluginRegistry = { dummyPlugin: 'b' };
      const exposedValue = {
        registerListener: domEventsPlugin.registerListener,
        unregisterListener: domEventsPlugin.unregisterListener,
        dispatchEvent: domEventsPlugin.dispatchEvent,
      };

      const registerReturnValue = domEventsPlugin.register(pluginRegistry);

      expect(registerReturnValue).to.deep.equal(exposedValue);
    });
  });

  describe('registerListener()', () => {
    it('should call addEventListener with eventName and callback', () => {
      const eventName = 'fetchProducts';
      const callback = () => null;
      const addEventListener = stub(domEventsPlugin.window, 'addEventListener');

      domEventsPlugin.registerListener(eventName, callback);

      expect(addEventListener).to.be.calledWith(eventName, callback);
    });
  });

  describe('unregisterListen()', () => {
    it('should call removeEventListener with eventName and callback', () => {
      const eventName = 'fetchProducts';
      const callback = () => null;
      const removeEventListener = stub(domEventsPlugin.window, 'removeEventListener');

      domEventsPlugin.unregisterListener(eventName, callback);

      expect(removeEventListener).to.be.calledWith(eventName, callback);
    });
  });

  describe('dispatchEvent()', () => {
    it('should call dispatch with eventName and payload', () => {
      const eventName = 'fetchProducts';
      const payload = { a: 'b' };
      const dispatchEvent = stub(domEventsPlugin.window, 'dispatchEvent');
      const eventToDispatch = new domEventsPlugin.CustomEvent(eventName, { detail: payload });

      domEventsPlugin.dispatchEvent(eventName, payload);

      expect(dispatchEvent).to.be.calledWith(eventToDispatch);
    });
  });
});
