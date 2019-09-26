import { expect, spy, stub } from '../../utils';
import { SaytDriverPlugin } from '../../../src/index';
import {
  AUTOCOMPLETE_REQUEST,
  AUTOCOMPLETE_RESPONSE,
  AUTOCOMPLETE_ERROR,
  SAYT_PRODUCTS_REQUEST,
  SAYT_PRODUCTS_RESPONSE,
  SAYT_PRODUCTS_ERROR,
} from '@sfx/events';

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
        group: 'some-group-id',
      },
    };
    productDataPayload = {
      detail: {
        query,
        config,
        group: 'some-group-id',
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

    it('should register event listeners for sayt and product data requests', () => {
      registerListener = dom_events.registerListener = spy();
      driver.core = {
        dom_events,
      };

      driver.ready();

      expect(registerListener).to.be.calledWith(AUTOCOMPLETE_REQUEST, driver.fetchAutocompleteTerms);
      expect(registerListener).to.be.calledWith(SAYT_PRODUCTS_REQUEST, driver.fetchProductData);
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

      expect(unregisterListener).to.have.been.calledWith(AUTOCOMPLETE_REQUEST, driver.fetchAutocompleteTerms);
      expect(unregisterListener).to.have.been.calledWith(SAYT_PRODUCTS_REQUEST, driver.fetchProductData);
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

    it('should resolve to the result of the Sayt API callback', () => {
      const callbackReturn = ['a', 'b'];
      autocompleteCallback.returns(callbackReturn);

      const returnValue = driver.sendAutocompleteApiRequest(saytDataPayload);

      return expect(returnValue).to.eventually.deep.equal(callbackReturn);
    });
  });

  describe('fetchAutocompleteTerms()', () => {
    let dispatchEvent;
    let results;
    let group;
    let sendAutocompleteApiRequest;

    beforeEach(() => {
      dispatchEvent = dom_events.dispatchEvent = spy();
      driver.core = {
        dom_events,
      };
      results =  { a: 'b' };
      sendAutocompleteApiRequest = stub(driver, 'sendAutocompleteApiRequest');
      group = 'some-group-id';
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
        .to.be.eventually.calledOnceWith(AUTOCOMPLETE_RESPONSE, { results, group });
    });

    it('should send an error in an event if the API request fails', () => {
      const error = new Error('test error');
      sendAutocompleteApiRequest.rejects(error);

      driver.fetchAutocompleteTerms(saytDataPayload);

      return expect(Promise.resolve(dispatchEvent))
        .to.be.eventually.calledOnceWith(AUTOCOMPLETE_ERROR, { error, group });
    });
  });

  describe('fetchProductData()', () => {
    let dispatchEvent;
    let products;
    let group;
    let sendSearchApiRequest;

    beforeEach(() => {
      dispatchEvent = dom_events.dispatchEvent = spy();
      driver.core = {
        dom_events,
      };
      products = [{ a: 'b' }];
      sendSearchApiRequest = stub(driver, 'sendSearchApiRequest');
      group = 'some-group-id';
    });

    it('should call sendSearchApiRequest with query from event and valid config', () => {
      sendSearchApiRequest.resolves({ products });

      driver.fetchProductData(productDataPayload);

      expect(sendSearchApiRequest).to.be.calledWith(query, config);
    });

    it('should dispatch the response through the events plugin', () => {
      sendSearchApiRequest.resolves({ products });

      driver.fetchProductData(productDataPayload);

      return expect(Promise.resolve(dispatchEvent))
        .to.be.eventually.calledOnceWith(SAYT_PRODUCTS_RESPONSE, { products, group });
    });

    it('should send an error in an event if the API request fails', () => {
      const error = new Error('test error');
      sendSearchApiRequest.rejects(error);

      driver.fetchProductData(saytDataPayload);

      return expect(Promise.resolve(dispatchEvent))
        .to.be.eventually.calledOnceWith(SAYT_PRODUCTS_ERROR, { error, group });
    });
  });

  describe('sendSearchApiRequest()', () => {
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

  describe('parseRecord()', () => {
    let record;

    beforeEach(() => {
      record = {
        allMeta: {},
      };
    });

    it('should throw if product has no visual variants', () => {
      const callback = () => driver.parseRecord(record);

      expect(callback).to.throw();
    });

    it('should throw if product has no non-visual variants', () => {
      record.allMeta.visualVariants = [{
        nonvisualVariants: [],
      }];
      const callback = () => driver.parseRecord(record);

      expect(callback).to.throw();
    });

    it('should throw if product has undefined non-visual variant', () => {
      record.allMeta.visualVariants = [{
        nonvisualVariants: [undefined],
      }];
      const callback = () => driver.parseRecord(record);

      expect(callback).to.throw();
    });

    it('should return data segments if product has valid data', () => {
      const nonvisualVariants = [{}, {}];
      const firstVariant = { nonvisualVariants };
      const data = {
        visualVariants: [ firstVariant ],
      };
      record = { allMeta: data };

      const result = driver.parseRecord(record);

      expect(result).to.deep.equal({ data, firstVariant, nonvisualVariants });
    });
  });

  describe('searchCallback()', () => {
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

    it('should return a complete product object', () => {
      const expectedResponse = {
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

    it('should filter out an incomplete product object', () => {
      const goodObject = {
        allMeta: {
          title: 'some-title',
          visualVariants: [{
            productImage: 'some-link',
            nonvisualVariants: [{
              originalPrice: 3.99,
            }],
          }],
        },
      };

      const badObject1 = {
        allMeta: {}
      };

      const badObject2 = {
        allMeta: {
          title: 'some-title',
          visualVariants: [],
        }
      };

      const expectedGoodObject = {
        title: 'some-title',
        price: 3.99,
        imageSrc: 'some-link',
        imageAlt: 'some-title',
        productUrl: 'some-link',
      };

      const input = {
        records: [
          goodObject,
          goodObject,
          badObject1,
          badObject2,
          badObject2,
          goodObject,
        ],
      };

      const expectedResponse = {
        products: [
          expectedGoodObject,
          expectedGoodObject,
          expectedGoodObject,
        ],
      };

      const actualProduct = driver.searchCallback(input);

      expect(actualProduct).to.deep.equal(expectedResponse);
    });
  });
});
