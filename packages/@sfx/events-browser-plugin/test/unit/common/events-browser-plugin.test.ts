import { events } from 'chai';
import { assert as sinonAssert, match, spy, stub } from 'sinon';
import EventsBrowserPlugin from '../../../src/events-browser-plugin';

describe('EventsBrowserPlugin', () => {
  let eventsBrowserPlugin: any;
  let options: any = {};
  
  beforeEach(() => {
    eventsBrowserPlugin = new EventsBrowserPlugin(options);
  });
});
