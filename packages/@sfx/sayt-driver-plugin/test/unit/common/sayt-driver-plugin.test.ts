import { expect, spy, stub } from '../../utils';
import { SaytDriverPlugin } from '../../../src/index';

describe('Sayt Driver Plugin', () => {
  let config;
  let driver;
  let dom_events;
  let sayt;
  let search;
  let saytDataPayload;
  let productDataPayload;
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
    search = {
      search: (query, callback) => null,
    };
    driver = new SaytDriverPlugin();
    config = {
      collection: 'backup',
    };
    saytDataPayload = {
      detail: {
        query,
        config,
        searchbox: 'some-searchbox-id',
      },
    };
    productDataPayload = {
      detail: {
        query,
        config,
        searchbox: 'some-searchbox-id',
      },
    };
  });

  describe('get metadata()', () => {
    it('should specify a plugin name of sayt_driver', () => {
      expect(driver.metadata.name).to.equal('sayt_driver');
    });

    it('should have dependencies: "dom_events", "sayt", and "search"', () => {
      expect(driver.metadata.depends).to.have.members(['dom_events', 'sayt', 'search']);
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

      expect(registerListener).to.be.calledWith(driver.autocompleteRequestEvent, driver.fetchAutocompleteTerms);
      expect(registerListener).to.be.calledWith(driver.productRequestEvent, driver.fetchProductData);
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

      expect(unregisterListener).to.have.been.calledWith(driver.autocompleteRequestEvent, driver.fetchAutocompleteTerms);
      expect(unregisterListener).to.have.been.calledWith(driver.productRequestEvent, driver.fetchProductData);
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

  describe('sendAutocompleteApiRequest()', () => {
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
      driver.sendAutocompleteApiRequest(query, config);

      expect(autocomplete).to.be.calledWith(
        query,
        config,
      );
    });

    it('should return the result of the Sayt API callback', () => {
      const callbackReturn = ['a', 'b'];
      autocompleteCallback.returns(callbackReturn);

      const returnValue = driver.sendAutocompleteApiRequest(saytDataPayload);

      return expect(returnValue).to.eventually.deep.equal(callbackReturn);
    });
  });

  describe('fetchAutocompleteTerms()', () => {
    let dispatchEvent;
    let results;
    let searchbox;
    let sendAutocompleteApiRequest;

    beforeEach(() => {
      dispatchEvent = dom_events.dispatchEvent = spy();
      driver.core = {
        dom_events,
      };
      results =  { a: 'b' };
      sendAutocompleteApiRequest = stub(driver, 'sendAutocompleteApiRequest');
      searchbox = 'some-searchbox-id';
    });

    it('should call sendAutocompleteApiRequest with query from event and valid config', () => {
      sendAutocompleteApiRequest.resolves(results);

      driver.fetchAutocompleteTerms(saytDataPayload);

      expect(sendAutocompleteApiRequest).to.be.calledWith(query, config);
    });

    it('should dispatch the response through the events plugin', () => {
      sendAutocompleteApiRequest.resolves(results);

      driver.fetchAutocompleteTerms(saytDataPayload);

      return expect(Promise.resolve(dispatchEvent))
        .to.be.eventually.calledOnceWith(driver.autocompleteResponseEvent, { results, searchbox });
    });

    it('should send an error in an event if the API request fails', () => {
      const error = new Error('test error');
      sendAutocompleteApiRequest.rejects(error);

      driver.fetchAutocompleteTerms(saytDataPayload);

      return expect(Promise.resolve(dispatchEvent))
        .to.be.eventually.calledOnceWith(driver.autocompleteErrorEvent, error);
    });
  });

  describe('fetchProductData', () => {
    let dispatchEvent;
    let results;
    let searchbox;
    let sendSearchApiRequest;

    beforeEach(() => {
      dispatchEvent = dom_events.dispatchEvent = spy();
      driver.core = {
        dom_events,
      };
      results = { a: 'b' };
      sendSearchApiRequest = stub(driver, 'sendSearchApiRequest');
      searchbox = 'some-searchbox-id';
    });

    it('should call sendSearchApiRequest with query from event and valid config', () => {
      sendSearchApiRequest.resolves(results);

      driver.fetchProductData(productDataPayload);

      expect(sendSearchApiRequest).to.be.calledWith(query, config);
    });

    it('should dispatch the response through the events plugin', () => {
      sendSearchApiRequest.resolves(results);

      driver.fetchProductData(productDataPayload);

      return expect(Promise.resolve(dispatchEvent))
        .to.be.eventually.calledOnceWith(driver.productResponseEvent, { results, searchbox });
    });

    it('should send an error in an event if the API request fails', () => {
      const error = new Error('test error');
      sendSearchApiRequest.rejects(error);

      driver.fetchProductData(saytDataPayload);

      return expect(Promise.resolve(dispatchEvent))
        .to.be.eventually.calledOnceWith(driver.productErrorEvent, error);
    });
  });

  describe('sendSearchApiRequest', () => {
    let searchStub;
    let searchCallback;

    beforeEach(() => {
      searchStub = stub(search, 'search').resolves({});
      searchCallback = stub(driver, 'searchCallback');
      driver.core = {
        search,
      };
    });

    it('should make a search call through the search client with all fields', () => {
      driver.sendSearchApiRequest(query, config);

      expect(searchStub).to.be.calledWith({
        query,
        fields: ['*'],
        ...config
      });
    });

    it('should return the result of the Search API callback', () => {
      const callbackReturn = { a: 'b' };
      searchCallback.returns(callbackReturn);

      const returnValue = driver.sendSearchApiRequest(productDataPayload);

      return expect(returnValue).to.eventually.deep.equal(callbackReturn);
    });
  });

  describe('searchCallback', () => {
    let response;
    beforeEach(() => {
      response = {
        records: [
          {
            allMeta: {},
          }
        ]
      };
    });

    it('should not throw if product has no visual variants', () => {
      const func = () => driver.searchCallback(response);

      expect(func).to.not.throw();
    });

    it('should not throw if product has no non-visual variants', () => {
      response.records[0].allMeta.visualVariants = [{
        nonvisualVariants: [],
      }];

      const func = () => driver.searchCallback(response);

      expect(func).to.not.throw();
    });

    it('should not throw if product has undefined non-visual variant', () => {
      response.records[0].allMeta.visualVariants = [{
        nonvisualVariants: [undefined],
      }];

      const func = () => driver.searchCallback(response);

      expect(func).to.not.throw();
    });

    it('should return a complete product object', () => {
      const expectedResponse = {
        query: undefined,
        products: [
          {
            title: 'some-title',
            price: 3.99,
            imageSrc: 'some-link',
            imageAlt: 'some-title',
            productUrl: 'some-link',
          },
        ],
      };

      const input = {
        records: [{
          allMeta: {
            title: 'some-title',
            visualVariants: [{
              productImage: 'some-link',
              nonvisualVariants: [{
                originalPrice: 3.99,
              }],
            }],
          },
        }],
      };

      const actualProduct = driver.searchCallback(input);

      expect(actualProduct).to.deep.equal(expectedResponse);
    });

    it.skip('should return an object containing the query and products', () => {
      const response = {
        query: 'some-query',
        records: ['first-product', 'second-product'],
      };

      const result = driver.searchCallback(response);

      expect(result).to.deep.equal({
        query: response.query,
        products: response.records,
      });
    });
  });
});
