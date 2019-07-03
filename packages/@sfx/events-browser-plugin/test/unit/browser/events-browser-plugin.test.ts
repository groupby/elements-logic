import { expect, sinon, spy, stub } from '../../utils';
import EventsBrowserPlugin from '../../../src/events-browser-plugin';

describe('EventsBrowserPlugin', () => {
  let eventsBrowserPlugin: any;

  beforeEach(() => {
    eventsBrowserPlugin = new EventsBrowserPlugin({ window: new Window() });
  });

  describe('constructor()', () => {
    it('should have an options property equal to and empty object', () => {
      expect(eventsBrowserPlugin.options).to.deep.equal({});
    });

    it('should create an EventsBrowserPlugin with default options', () => {
      const defaultOptions: any = {
        a: 'b',
        c: 'd',
      }
      eventsBrowserPlugin.options = defaultOptions;

      const newEventsBrowserPluginInstance = new EventsBrowserPlugin();

      expect(newEventsBrowserPluginInstance.options).to.deep.equal(defaultOptions);
    });

    it('should override default options', () => {
      const options: any = {
        a: 'b',
        c: 'd'
      };
      eventsBrowserPlugin = new EventsBrowserPlugin(options);

      expect(eventsBrowserPlugin.options).to.deep.equal(options);
    });

    it('should define an object to the window property', () => {
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
});
