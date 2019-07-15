import { expect, sinon, spy, stub } from '../../utils';
import SaytDriverPlugin from '../../../src/sayt-driver-plugin';
import { DomEventsPlugin } from '../../../../dom-events-plugin/src/index';

describe('Sayt Driver Plugin', () => {
  let saytDriverPlugin: any;

  // const events = new DomEventsPlugin();
  // const sayt = new SaytPlugin();


  beforeEach(() => {
    saytDriverPlugin = new SaytDriverPlugin();
    saytDriverPlugin.register({
      'dom_events': new DomEventsPlugin(),
      // 'sayt': new SaytPlugin({
      //   subdomain: 'cvshealth',
      //   https: true,
      // }),
      sayt: { autocomplete: (query, config, callback) => {
        return callback();
      }},
    });
  });

  describe('.ready()', () => {
    let registerListener: any;
    beforeEach(() => {
      registerListener = spy(saytDriverPlugin.core['dom_events'], 'registerListener');
    });
    it.skip('should register two event listeners', () => {
      saytDriverPlugin.ready();
      expect(registerListener).to.have.been.calledTwice;
    });
    it('the first should be for receiving sayt API requests', () => {
      saytDriverPlugin.ready();
      registerListener.getCall(0)
        .calledWith(saytDriverPlugin.saytDataEvent, saytDriverPlugin.fetchSaytData)
    });
    it.skip('the second should be for receiving search API requests', () => {
      saytDriverPlugin.ready();
      registerListener.getCall(1)
        .calledWith(saytDriverPlugin.saytProductsEvent, saytDriverPlugin.fetchSaytProducts)
    });
  });

  describe('.unregister()', () => {
    let unregisterListener;
    beforeEach(() => {
      unregisterListener = spy(saytDriverPlugin.core['dom_events'], 'unregisterListener');
    });
    it('should unregister the sayt event listener', () => {
      saytDriverPlugin.unregister();
      expect(unregisterListener).to.have.been.calledWith(saytDriverPlugin.saytDataEvent, saytDriverPlugin.fetchSaytData);
    });
  });

  describe('.autocompleteCallback', () => {
    const response = {
      result: {
        searchTerms: [
          { value: 'a' , notValue: 'z' },
          { value: 'b' },
          { value: 'c' },
        ],
      },
    };
    it('should return an array of search terms strings from the sayt response', () => {
      expect(saytDriverPlugin.autocompleteCallback(undefined, response))
        .to.deep.equal(['a', 'b', 'c']);
    });
  });

  describe.only('.sendSaytAPIRequest()', () => {
    const saytDataPayload = {
      query: 'soap',
      collection: 'productsLeaf',
    };
    let autocompleteCallback;

    beforeEach(() => {
      autocompleteCallback = stub(saytDriverPlugin, 'autocompleteCallback');
    });
    it('should make a search call through the sayt client', () => {
      // console.log(saytDriverPlugin.core.sayt.autocomplete);
      const autocomplete = stub(saytDriverPlugin.core.sayt, 'autocomplete').returns(true);
      saytDriverPlugin.sendSaytAPIRequest(saytDataPayload);
      expect(autocomplete).to.be.calledWith(saytDataPayload.query, { collection: 'productsLeaf' }, autocompleteCallback);
    });
    it('should return the result of the Sayt API callback', () => {
      autocompleteCallback.returns(['a', 'b']);
      expect(saytDriverPlugin.sendSaytAPIRequest(saytDataPayload)).to.equal(autocompleteCallback());
    });
  });
});
