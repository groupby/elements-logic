import { expect, spy, stub } from '../../utils';
import { SaytDriverPlugin } from '../../../src/index';

describe('Sayt Driver Plugin', () => {
  let driver;
  let dom_events;
  let sayt;

  beforeEach(() => {
    dom_events = {
      registerListener: (eventName, data) => null,
      unregisterListener: (eventName, data) => null,
      dispatchEvent: (eventName, data) => null,
    };
    sayt = {
      autocomplete: (query, config, callback) => {
        return new Promise((res, rej) => {
          res(callback(undefined, 'response'));
        });
      },
    };
    driver = new SaytDriverPlugin();
  });

  describe('get metadata()', () => {
    it('should specify a plugin name of sayt_driver', () => {
      expect(driver.metadata.name).to.equal('sayt_driver');
    });

    it('should have two dependencies: "dom_events" and "sayt"', () => {
      expect(driver.metadata.depends).to.have.members(['dom_events', 'sayt']);
    });
  });

  describe('register()', () => {
    it('should keep a reference to all registered plugins', () => {
      const plugins = {
        a: () => 'a',
        b: () => true,
      };

      expect(driver.core).to.be.undefined;
      driver.register(plugins);

      expect(driver.core).to.equal(plugins);
    });
  });

  describe('ready()', () => {
    let registerListener;

    beforeEach(() => {
      driver.core = {
        dom_events,
      };
      registerListener = spy(driver.core['dom_events'], 'registerListener');
    });

    it('should register an event listener for receiving sayt API requests', () => {
      driver.ready();

      expect(registerListener).to.be.calledWith(driver.saytDataEvent, driver.fetchSaytData);
    });
  });

  describe('unregister()', () => {
    let unregisterListener;

    beforeEach(() => {
      driver.core = {
        dom_events,
      };
      unregisterListener = spy(driver.core['dom_events'], 'unregisterListener');
    });

    it('should unregister the sayt event listener', () => {
      driver.unregister();

      expect(unregisterListener).to.have.been.calledWith(driver.saytDataEvent, driver.fetchSaytData);
    });
  });

  describe('autocompleteCallback()', () => {
    it('should return an array of search term strings from the sayt response', () => {
      const terms = {
        result: {
          searchTerms: [
            { value: 'a' , notValue: 'z' },
            { value: 'b' },
            { value: 'c' },
          ],
        },
      };

      const cbReturn = driver.autocompleteCallback(undefined, terms);

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

      const cbReturn = driver.autocompleteCallback(undefined, response);

      expect(cbReturn).to.deep.equal(['a', 'c']);
    });

    it('should return an empty array if there are no searchTerms', () => {
      const response = {
        result: {
          searchTerms: [],
        },
      };

      const cbReturn = driver.autocompleteCallback(undefined, response);

      expect(cbReturn).to.deep.equal([]);
    });
  });

  describe('sendSaytApiRequest()', () => {
    let saytDataPayload;
    let autocompleteCallback;

    beforeEach(() => {
      driver.core = {
        sayt,
      };
      saytDataPayload = {
        query: 'shirt',
        collection: 'backup',
      };
      autocompleteCallback = stub(driver, 'autocompleteCallback');
    });

    it('should make a search call through the sayt client', () => {
      const autocomplete = stub(driver.core.sayt, 'autocomplete').returns(true);

      driver.sendSaytApiRequest(saytDataPayload);

      expect(autocomplete).to.be.calledWith(
        saytDataPayload.query,
        { collection: 'backup' },
        autocompleteCallback,
      );
    });

    it('should return the result of the Sayt API callback', () => {
      const callbackReturn = ['a', 'b'];
      autocompleteCallback.returns(['a', 'b']);

      const returnValue = driver.sendSaytApiRequest(saytDataPayload);

      return expect(returnValue).to.eventually.deep.equal(callbackReturn);
    });
  });

  describe('fetchSaytData()', () => {
    let query;
    let response;
    let dispatchEvent;
    let sendSaytApiRequest;

    beforeEach(() => {
      driver.core = {
        dom_events,
        sayt,
      };
      query = {
        query: 'shirt',
      };
      response = { a: 'b' };
      dispatchEvent = spy(driver.core['dom_events'], 'dispatchEvent');
      sendSaytApiRequest = stub(driver, 'sendSaytApiRequest');
    });

    it('should get a response from Sayt client request method', () => {
      sendSaytApiRequest.resolves(response);

      driver.fetchSaytData(query);

      expect(sendSaytApiRequest).to.be.calledWith(query);
    });

    it('should dispatch the response through the events plugin', () => {
      sendSaytApiRequest.resolves(response);

      driver.fetchSaytData(query);

      return expect(Promise.resolve(dispatchEvent))
        .to.be.eventually.calledOnceWith(driver.saytResponseEvent, response);
    });

    it('should send an error in an event if the API request fails', () => {
      const error = new Error('test error');
      sendSaytApiRequest.rejects(error);

      driver.fetchSaytData(query);

      return expect(Promise.resolve(dispatchEvent))
        .to.be.eventually.calledOnceWith(driver.saytErrorEvent, error);
    });
  });
});
