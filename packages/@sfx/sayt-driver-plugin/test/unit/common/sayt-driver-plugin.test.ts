import { expect, spy, stub } from '../../utils';
import { SaytDriverPlugin } from '../../../src/index';

describe('Sayt Driver Plugin', () => {
  let config;
  let driver;
  let dom_events;
  let sayt;
  let saytDataPayload;
  let saytDataUndefinedConfig;
  const query = 'shirt';

  beforeEach(() => {
    dom_events = {
      registerListener: (eventName, data) => null,
      unregisterListener: (eventName, data) => null,
      dispatchEvent: (eventName, data) => null,
    };
    sayt = {
      autocomplete: (query, config, callback) => null,
    };
    driver = new SaytDriverPlugin();
    config = {
      collection: 'backup',
    };
    saytDataPayload = {
      detail: {
        query,
        config,
      },
    };
    saytDataUndefinedConfig = {
      detail: {
        query,
      },
    };
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

    it('should register event listeners for receiving requests sayt and product data', () => {
      registerListener = dom_events.registerListener = spy();
      driver.core = {
        dom_events,
      };

      driver.ready();

      expect(registerListener).to.be.calledWith(driver.saytDataEvent, driver.fetchSaytData);
      expect(registerListener).to.be.calledWith(driver.productDataEvent, driver.fetchProductData);
    });
  });

  describe('unregister()', () => {
    let unregisterListener;

    it('should unregister the sayt event listener', () => {
      unregisterListener = dom_events.unregisterListener = spy();
      driver.core = {
        dom_events,
      };

      driver.unregister();

      expect(unregisterListener).to.have.been.calledWith(driver.saytDataEvent, driver.fetchSaytData);
      expect(unregisterListener).to.have.been.calledWith(driver.productDataEvent, driver.fetchProductData);
    });
  });

  describe('autocompleteCallback()', () => {
    let constructSearchTerms;

    beforeEach(() => {
      constructSearchTerms = stub(driver, 'constructSearchTerms');
    });

    it('should return an empty title for the search terms object', () => {
      const terms = {
        result: {
          searchTerms: [],
        },
      };
      const expectedReturn = [
        {
          title: '',
          items: [],
        },
      ];
      constructSearchTerms.returns([]);

      const cbReturn = driver.autocompleteCallback(terms);

      expect(cbReturn).to.deep.equal(expectedReturn);
    });

    it('should return a nested array of search term objects from the sayt response', () => {
      const terms = {
        result: {
          searchTerms: [
            { value: 'a' },
            { value: 'b' },
            { value: 'c' },
          ],
        },
      };
      const expectedReturn = [
        {
          title: '',
          items: [
            { label: 'a' },
            { label: 'b' },
            { label: 'c' },
          ],
        },
      ];
      constructSearchTerms.returns([
        { label: 'a' },
        { label: 'b' },
        { label: 'c' },
      ]);

      const cbReturn = driver.autocompleteCallback(terms);

      expect(cbReturn).to.deep.equal(expectedReturn);
    });

    it('should return an empty item list if there are no search terms', () => {
      const response = {
        result: {
          searchTerms: null,
        },
      };
      const expectedReturn = [
        {
          title: '',
          items: [],
        },
      ];
      constructSearchTerms.returns([]);

      const cbReturn = driver.autocompleteCallback(response);

      expect(cbReturn).to.deep.equal(expectedReturn);
    });
  })

  describe('constructSearchTerms()', () => {
    it('should return search term values as search term labels', () => {
      const terms = [
        { value: 'a', notValue: 'z'  },
        { value: 'b' },
        { value: 'c' },
      ];
      const expectedReturn = [
        { label: 'a' },
        { label: 'b' },
        { label: 'c' },
      ];

      const searchTerms = driver.constructSearchTerms(terms);

      expect(searchTerms).to.deep.equal(expectedReturn);
    });

    it('should only return items that have a searchterm value', () => {
      const terms = [
        { value: 'a' },
        {},
        { value: 'c' },
      ];
      const expectedReturn = [
        { label: 'a' },
        { label: 'c' },
      ];

      const searchTerms = driver.constructSearchTerms(terms);

      expect(searchTerms).to.deep.equal(expectedReturn);
    });
  });

  describe('sendSaytApiRequest()', () => {
    let autocomplete;
    let autocompleteCallback;

    beforeEach(() => {
      autocompleteCallback = stub(driver, 'autocompleteCallback');
      autocomplete = stub(sayt, 'autocomplete').resolves(autocompleteCallback);
      driver.core = {
        sayt,
      };
    });

    it('should make a search call through the sayt client', () => {
      driver.sendSaytApiRequest(query, config);

      expect(autocomplete).to.be.calledWith(
        query,
        config,
      );
    });

    it('should return the result of the Sayt API callback', () => {
      const callbackReturn = ['a', 'b'];
      autocompleteCallback.returns(callbackReturn);

      const returnValue = driver.sendSaytApiRequest(saytDataPayload);

      return expect(returnValue).to.eventually.deep.equal(callbackReturn);
    });
  });

  describe('fetchSaytData()', () => {
    let dispatchEvent;
    let results;
    let searchbox;
    let sendSaytApiRequest;

    beforeEach(() => {
      dispatchEvent = dom_events.dispatchEvent = spy();
      driver.core = {
        dom_events,
      };
      results =  { a: 'b' };
      sendSaytApiRequest = stub(driver, 'sendSaytApiRequest');
    });

    it('should not throw with undefined config', () => {
      sendSaytApiRequest.resolves(results);
      const callSayt = () => { driver.fetchSaytData(saytDataUndefinedConfig) };

      expect(callSayt).to.not.throw();
    });

    it('should call sendSaytApiRequest with query from event and valid config', () => {
      sendSaytApiRequest.resolves(results);

      driver.fetchSaytData(saytDataPayload);

      expect(sendSaytApiRequest).to.be.calledWith(query, config);
    });

    it('should dispatch the response through the events plugin', () => {
      sendSaytApiRequest.resolves(results);

      driver.fetchSaytData(saytDataPayload);

      return expect(Promise.resolve(dispatchEvent))
        .to.be.eventually.calledOnceWith(driver.saytResponseEvent, { results, searchbox });
    });

    it('should send an error in an event if the API request fails', () => {
      const error = new Error('test error');
      sendSaytApiRequest.rejects(error);

      driver.fetchSaytData(saytDataPayload);

      return expect(Promise.resolve(dispatchEvent))
        .to.be.eventually.calledOnceWith(driver.saytErrorEvent, error);
    });
  });

  describe('fetchProductData', () => {

  });
});
