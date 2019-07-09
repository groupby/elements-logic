import { expect, stub } from '../../utils';
import DomEventsPlugin from '../../../src/dom-events-plugin';

describe('domEventsPlugin', () => {
  let domEventsPlugin: any;

  beforeEach(() => {
    domEventsPlugin = new DomEventsPlugin();
  });

  describe('metadata', () => {
    it('should be named dom_events', () => {
      const pluginName = domEventsPlugin.metadata.name === 'dom_events';

      expect(pluginName).to.be.true;
    });

    it('should not have any dependencies', () => {
      expect(domEventsPlugin.metadata.depends).to.deep.equal([]);
    })
  });

  describe('constructor()', () => {
    it('should create a DomEventsPlugin instance with default options', () => {
      const defaultOptions = { window: window, CustomEvent: CustomEvent };

      expect(domEventsPlugin.options).to.deep.equal(defaultOptions);
    });

    it('should combine default options and provided options', () => {
      const defaultOptions = { window: window, CustomEvent: CustomEvent };
      const options: any = { a: 'b', c: 'd' };

      domEventsPlugin = new DomEventsPlugin(options);

      expect(domEventsPlugin.options).to.deep.equal({ ...defaultOptions, ...options });
    });

    it('should override default options', () => {
      const windowObject = { windowProp: 'windowPropValue' };
      const CustomEvent = () => null;
      const options: any = {
        window: windowObject,
        CustomEvent: CustomEvent,
      };

      domEventsPlugin = new DomEventsPlugin(options);

      expect(domEventsPlugin.options.window).to.equal(windowObject);
      expect(domEventsPlugin.options.CustomEvent).to.equal(CustomEvent);
    });

    it('should set window property with the window option', () => {
      const windowObject = { windowProp: 'windowPropValue' };
      const options: any = { window: windowObject };

      domEventsPlugin = new DomEventsPlugin(options);

      expect(domEventsPlugin.window).to.equal(windowObject);
    });

    it('should set CustomEvent property with the CustomEvent option', () => {
      const CustomEvent = () => null;
      const options: any = { CustomEvent: CustomEvent };

      domEventsPlugin = new DomEventsPlugin(options);

      expect(domEventsPlugin.CustomEvent).to.equal(CustomEvent);
    });

    it('should throw an error if an invalid window option is provided', () => {
      const invalidOptions = {
        window: undefined,
      };

      expect(() => new DomEventsPlugin(invalidOptions)).to.throw();
    });

    it('should throw an error if an invalid CustomEvent constructor is provided', () => {
      const invalidOptions = {
        CustomEvent: undefined,
      };

      expect(() => new DomEventsPlugin(invalidOptions)).to.throw();
    });
  });

  describe('register()', () => {
    it('should return an exposedValue', () => {
      const exposedValue = {
        registerListener: domEventsPlugin.registerListener,
        unregisterListener: domEventsPlugin.unregisterListener,
        dispatchEvent: domEventsPlugin.dispatchEvent,
      };

      const registerReturnValue = domEventsPlugin.register({ dummyPlugin: 'b' });

      expect(registerReturnValue).to.deep.equal(exposedValue);
    });
  });

  describe('registerListener()', () => {
    it('should call window.addEventListener with eventName and callback', () => {
      const eventName = 'fetchProducts';
      const callback = () => null;
      const addEventListener = stub(domEventsPlugin.window, 'addEventListener');

      domEventsPlugin.registerListener(eventName, callback);

      expect(addEventListener).to.be.calledWith(eventName, callback);
    });
  });

  describe('unregisterListen()', () => {
    it('should call window.removeEventListener with eventName and callback', () => {
      const eventName = 'fetchProducts';
      const callback = () => null;
      const removeEventListener = stub(domEventsPlugin.window, 'removeEventListener');

      domEventsPlugin.unregisterListener(eventName, callback);

      expect(removeEventListener).to.be.calledWith(eventName, callback);
    });
  });

  describe('dispatchEvent()', () => {
    it('should call window.dispatch with eventName and payload', () => {
      const eventName = 'fetchProducts';
      const payload = { a: 'b' };
      const dispatchEvent = stub(domEventsPlugin.window, 'dispatchEvent');
      const eventToDispatch = new domEventsPlugin.CustomEvent(eventName, { detail: payload });

      domEventsPlugin.dispatchEvent(eventName, payload);

      expect(dispatchEvent).to.be.calledWith(eventToDispatch);
    });
  });
});
