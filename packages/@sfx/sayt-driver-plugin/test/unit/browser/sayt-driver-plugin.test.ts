import { expect, sinon, spy, stub } from '../../utils';
import { SaytDriverPlugin } from '../../../src/index';
import { DomEventsPlugin } from '../../../../dom-events-plugin/src/index';
import { SaytPlugin } from '../../../../sayt-plugin/src';

describe('Sayt Driver Plugin', () => {
  let Driver: any;

  beforeEach(() => {
    Driver = new SaytDriverPlugin();
    Driver.register({
      'dom_events': new DomEventsPlugin().register({}),
      'sayt': new SaytPlugin({
        subdomain: 'cvshealth',
        https: true,
      }).register(),
    });
  });

  describe('.register()', () => {
    beforeEach(() => {
      Driver = {};
    })

    it('should keep a reference to all registered plugins', () => {
      const Plugins = {
        a: () => 'a',
        b: () => true,
      }
      Driver = new SaytDriverPlugin();

      expect(Driver.core).to.be.undefined;
      Driver.register(Plugins);

      expect(Driver.core).to.deep.equal(Plugins);
    });
  });

  describe('.ready()', () => {
    let registerListener: any;

    beforeEach(() => {
      registerListener = spy(Driver.core['dom_events'], 'registerListener');
    });

    it('should register an event listener for receiving sayt API requests', () => {
      Driver.ready();

      registerListener.getCall(0).calledWith(Driver.saytDataEvent, Driver.fetchSaytData);
    });
  });

  describe('.unregister()', () => {
    let unregisterListener;

    beforeEach(() => {
      unregisterListener = spy(Driver.core['dom_events'], 'unregisterListener');
    });

    it('should unregister the sayt event listener', () => {
      Driver.unregister();

      expect(unregisterListener).to.have.been.calledWith(Driver.saytDataEvent, Driver.fetchSaytData);
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
      expect(Driver.autocompleteCallback(undefined, response))
        .to.deep.equal(['a', 'b', 'c']);
    });
  });

  describe('.sendSaytAPIRequest()', () => {
    const saytDataPayload = {
      query: 'soap',
      collection: 'productsLeaf',
    };
    let autocompleteCallback;

    beforeEach(() => {
      autocompleteCallback = stub(Driver, 'autocompleteCallback');
    });

    it('should make a search call through the sayt client', () => {
      const autocomplete = spy(Driver.core.sayt, 'autocomplete');

      Driver.sendSaytAPIRequest(saytDataPayload);

      expect(autocomplete).to.be.calledWith(saytDataPayload.query, { collection: 'productsLeaf' }, autocompleteCallback);
    });

    it('should return the result of the Sayt API callback', () => {
      autocompleteCallback.returns(['a', 'b']);
      const callbackReturn = autocompleteCallback();

      const returnValue = Driver.sendSaytAPIRequest(saytDataPayload);

      expect(returnValue).to.eventually.equal(callbackReturn);
    });
  });

  describe('.fetchSaytData()', () => {
    const query = {
      query: 'soap',
    };
    let sendSaytAPIRequest;

    beforeEach(() => {
      sendSaytAPIRequest = stub(Driver, 'sendSaytAPIRequest').callThrough();
    });

    it('should get a response from API request method', () => {
      Driver.fetchSaytData(query);

      expect(sendSaytAPIRequest).to.be.calledWith(query);
    });

    it('should dispatch the response through the events plugin', () => {
      const dispatch = stub(Driver.core['dom_events'], 'dispatchEvent');
      const response = { a: 'b' };
      sendSaytAPIRequest.returns(response);

      Driver.fetchSaytData(query);

      expect(Promise.resolve(dispatch)).to.be.eventually.calledOnceWith(response);
    });
  });
});
