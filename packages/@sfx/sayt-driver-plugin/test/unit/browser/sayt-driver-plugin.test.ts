import { expect, sinon, spy, stub } from '../../utils';
import SaytDriverPlugin from '../../../src/sayt-driver-plugin';
import { DomEventsPlugin } from '../../../../dom-events-plugin/src/index';

describe('Sayt Driver Plugin', () => {
  let saytDriverPlugin: any;

  beforeEach(() => {
    saytDriverPlugin = new SaytDriverPlugin();
    saytDriverPlugin.register({
      'events-browser-plugin': new DomEventsPlugin(),
    });
  });

  describe('ready', () => {
    let registerListener: any;
    beforeEach(() => {
      registerListener = spy(saytDriverPlugin.core['dom_events'], 'registerListener');
    });
    it('should register two event listeners', () => {
      saytDriverPlugin.ready();
      expect(registerListener).to.have.been.calledTwice;
    });
    it('the first should be for receiving sayt API requests', () => {
      saytDriverPlugin.ready();
      registerListener.getCall(0)
        .calledWith(saytDriverPlugin.saytDataEvent, saytDriverPlugin.fetchSaytData)
    });
    it('the second should be for receiving search API requests', () => {
      saytDriverPlugin.ready();
      registerListener.getCall(1)
        .calledWith(saytDriverPlugin.saytProductsEvent, saytDriverPlugin.fetchSaytProducts)
    });
  });

  describe('unregister', () => {
    let unregisterListener: any;
    beforeEach(() => {
      unregisterListener = spy(saytDriverPlugin.core['dom_events'], 'unregisterListener');
    });
    it('should unregister two event listeners', () => {
      saytDriverPlugin.unregister();
      expect(unregisterListener).to.have.been.calledTwice;
    });
  });
});
