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
      autocomplete: (query, config, callback) => null,
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
      registerListener = dom_events.registerListener = spy();
      driver.core = {
        dom_events,
      };
    });

    it('should register an event listener for receiving sayt API requests', () => {
      driver.ready();

      expect(registerListener).to.be.calledWith(driver.saytDataEvent, driver.fetchSaytData);
    });
  });

  describe('unregister()', () => {
    let unregisterListener;

    beforeEach(() => {
      unregisterListener = dom_events.unregisterListener = spy();
      driver.core = {
        dom_events,
      };
    });

    it('should unregister the sayt event listener', () => {
      driver.unregister();

      expect(unregisterListener).to.have.been.calledWith(driver.saytDataEvent, driver.fetchSaytData);
    });
  });

  describe('autocompleteCallback()', () => {
    let constructSearchterms;

    beforeEach(() => {
      constructSearchterms = stub(driver, 'constructSearchterms');
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
      constructSearchterms.returns([]);

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
      constructSearchterms.returns([
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

      const cbReturn = driver.autocompleteCallback(response);

      expect(cbReturn).to.deep.equal(expectedReturn);
    });
  })

  describe('constructSearchterms()', () => {
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

      const searchTerms = driver.constructSearchterms(terms);

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

      const searchTerms = driver.constructSearchterms(terms);

      expect(searchTerms).to.deep.equal(expectedReturn);
    });
  });

  describe('sendSaytApiRequest()', () => {
    let autocomplete;
    let saytDataPayload;
    let autocompleteCallback;

    beforeEach(() => {
      autocomplete = sayt.autocomplete = stub().resolves(autocompleteCallback);
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
      driver.sendSaytApiRequest(saytDataPayload);

      expect(autocomplete).to.be.calledWith(
        saytDataPayload.query,
        { collection: 'backup' },
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
      dispatchEvent = dom_events.dispatchEvent = spy();
      driver.core = {
        dom_events,
      };
      query = {
        query: 'shirt',
      };
      response = { a: 'b' };
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
