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

      expect(eventsBrowserPlugin.options).to.deep.equal({ ...options, ...defaultOptions });
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
});