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
        subdomain: 'macystest',
        https: true,
      }).register(),
    });
  });

  describe('get metadata()', () => {
    it('should specify a plugin name of sayt-driver', () => {
      expect(Driver.metadata.name).to.equal('sayt_driver');
    });

    it('should have two dependencies: "dom_events" and "sayt"', () => {
      expect(Driver.metadata.depends).to.deep.equal(['dom_events', 'sayt']);
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
    it('should return an array of search term strings from the sayt response', () => {
      const response = {
        result: {
          searchTerms: [
            { value: 'a' , notValue: 'z' },
            { value: 'b' },
            { value: 'c' },
          ],
        },
      };

      const cbReturn = Driver.autocompleteCallback(undefined, response);

      expect(cbReturn).to.deep.equal(['a', 'b', 'c']);
    });

    it('should only return entries that have a searchterm value', () => {
      const response = {
        result: {
          searchTerms: [
            { value: 'a' },
            {},
            { value: 'c' },
          ],
        },
      };

      const cbReturn = Driver.autocompleteCallback(undefined, response);

      expect(cbReturn).to.deep.equal(['a', 'c']);
    });

    it('should return an empty array if there are no searchTerms', () => {
      const response = {
        result: {
          searchTerms: [],
        },
      };

      const cbReturn = Driver.autocompleteCallback(undefined, response);

      expect(cbReturn).to.deep.equal([]);
    });
  });

  describe('.sendSaytAPIRequest()', () => {
    const saytDataPayload = {
      query: 'shirt',
      collection: 'backup',
    };
    let autocompleteCallback;

    beforeEach(() => {
      autocompleteCallback = stub(Driver, 'autocompleteCallback');
    });

    it('should make a search call through the sayt client', () => {
      const autocomplete = spy(Driver.core.sayt, 'autocomplete');

      Driver.sendSaytAPIRequest(saytDataPayload);

      expect(autocomplete).to.be.calledWith(
        saytDataPayload.query,
        { collection: 'backup' },
        autocompleteCallback,
      );
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
      query: 'shirt',
    };
    let dispatchEvent;
    let sendSaytAPIRequest;

    beforeEach(() => {
      sendSaytAPIRequest = stub(Driver, 'sendSaytAPIRequest').callThrough();
      dispatchEvent = spy(Driver.core['dom_events'], 'dispatchEvent');
    });

    it('should get a response from Sayt client request method', () => {
      Driver.fetchSaytData(query);

      expect(sendSaytAPIRequest).to.be.calledWith(query);
    });

    it('should dispatch the response through the events plugin', () => {
      const response = { a: 'b' };
      sendSaytAPIRequest.returns(response);

      Driver.fetchSaytData(query);

      expect(Promise.resolve(dispatchEvent))
        .to.be.eventually.calledOnceWith(Driver.saytResponseEvent, response);
    });

    it('should send an error in an event if the API request fails', () => {
      sendSaytAPIRequest.rejects('test error');

      Driver.fetchSaytData(query);

      expect(Promise.resolve(dispatchEvent))
        .to.be.eventually.calledOnceWith(Driver.saytErrorEvent, 'test error');
    });
  });
});
