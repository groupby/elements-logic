import {
  AUTOCOMPLETE_REQUEST,
  AUTOCOMPLETE_RESPONSE,
  AUTOCOMPLETE_ERROR,
  BEACON_SEARCH,
  SAYT_PRODUCTS_REQUEST,
  SAYT_PRODUCTS_RESPONSE,
  SAYT_PRODUCTS_ERROR,
} from '@groupby/elements-events';
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
      registerListener: () => null,
      unregisterListener: () => null,
      dispatchEvent: () => null,
    };
    sayt = {
      autocomplete: () => null,
    };
    search = {
      search: () => null,
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
        origin: 'some-origin',
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

  describe('constructor()', () => {
    it('should save a passed product transformer as a transformProduct property', () => {
      const productTransformer: any = (() => 123);

      driver = new SaytDriverPlugin({ productTransformer });

      expect(driver.transformProduct).to.equal(productTransformer);
    });

    it('should have a default identity transformProduct property if no transformer is passed', () => {
      const object: any = { some: 'object' };
      driver = new SaytDriverPlugin();

      const result = driver.transformProduct(object);

      expect(result).to.equal(object);
    });
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
  });

  describe('constructSearchTerms()', () => {
    it('should return search term values as search term labels', () => {
      const terms = [
        { value: 'a', notValue: 'z' },
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
        config
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
    const group = 'some-group-id';
    let dispatchEvent;
    let results;
    let sendAutocompleteApiRequest;

    beforeEach(() => {
      dispatchEvent = dom_events.dispatchEvent = spy();
      driver.core = {
        dom_events,
      };
      results = { a: 'b' };
      sendAutocompleteApiRequest = stub(driver, 'sendAutocompleteApiRequest');
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

    it('should cache the payload', () => {
      const set = spy();
      driver.core.cache = { set };
      sendAutocompleteApiRequest.resolves(results);

      driver.fetchAutocompleteTerms(saytDataPayload);

      return expect(Promise.resolve(set))
        .to.be.eventually.calledOnceWith(`${AUTOCOMPLETE_RESPONSE}::${group}`, { results, group });
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
    let dispatchSearchBeacon;

    beforeEach(() => {
      dispatchEvent = dom_events.dispatchEvent = spy();
      driver.core = {
        dom_events,
      };
      products = [{ a: 'b' }];
      sendSearchApiRequest = stub(driver, 'sendSearchApiRequest');
      group = 'some-group-id';
      dispatchSearchBeacon = stub(driver, 'dispatchSearchBeacon');
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

    it('should cache the payload', () => {
      const set = spy();
      driver.core.cache = { set };
      sendSearchApiRequest.resolves({ products });

      driver.fetchProductData(saytDataPayload);

      return expect(Promise.resolve(set))
        .to.be.eventually.calledOnceWith(`${SAYT_PRODUCTS_RESPONSE}::${group}`, { products, group });
    });

    it('should send an error in an event if the API request fails', () => {
      const error = new Error('test error');
      sendSearchApiRequest.rejects(error);

      driver.fetchProductData(saytDataPayload);

      return expect(Promise.resolve(dispatchEvent))
        .to.be.eventually.calledOnceWith(SAYT_PRODUCTS_ERROR, { error, group });
    });

    it('should trigger a tracker event on a successful API request', () => {
      const results = { some: 'results' };
      const originalResponse = { results };
      const apiResponse = { products, originalResponse };
      sendSearchApiRequest.resolves(apiResponse);

      driver.fetchProductData(saytDataPayload);

      expect(Promise.resolve(dispatchSearchBeacon))
        .to.be.eventually.calledOnceWith(originalResponse, saytDataPayload.detail.origin);
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
        ...config,
      });
    });

    it('should return the result of the Search API callback', () => {
      const callbackReturn = { a: 'b' };
      searchCallback.returns(callbackReturn);

      const returnValue = driver.sendSearchApiRequest(productDataPayload);

      return expect(returnValue).to.eventually.deep.equal(callbackReturn);
    });
  });

  describe('searchCallback()', () => {
    const firstProductTitle = 'first-product';
    const secondProductTitle = 'second-product';
    let response;

    beforeEach(() => {
      response = {
        records: [
          {
            allMeta: {
              title: firstProductTitle,
            },
          },
          {
            allMeta: {
              title: secondProductTitle,
            },
          },
        ],
      };
    });

    it('should return a response with products', () => {
      const result = driver.searchCallback(response);

      expect(result.products).to.have.lengthOf(2);
      expect(result.products[0].allMeta.title).to.equal(firstProductTitle);
      expect(result.products[1].allMeta.title).to.equal(secondProductTitle);
    });

    it('should map products using the transform function', () => {
      const key2 = 'value2';
      driver.transformProduct = (product) => ({
        key1: product.allMeta.title,
        key2,
      });

      const result = driver.searchCallback(response);

      expect(result.products).to.deep.equal([
        { key1: firstProductTitle, key2 },
        { key1: secondProductTitle, key2 },
      ]);
    });

    it('should filter out any products that map to falsy values', () => {
      driver.transformProduct = (product, i) => {
        if (i === 1) return undefined;
        return {
          key1: product.allMeta.title,
        };
      };

      const result = driver.searchCallback(response);

      expect(result.products).to.have.lengthOf(1);
      expect(result.products[0].key1).to.equal(firstProductTitle);
    });
  });

  describe('dispatchSearchBeacon()', () => {
    it('should dispatch a BEACON_SEARCH event given a search response and origin', () => {
      const origin = 'some-origin';
      const results = { some: 'data' };
      const dispatchEvent = dom_events.dispatchEvent = spy();
      driver.core = { dom_events };

      driver.dispatchSearchBeacon(results, origin);

      expect(dispatchEvent).to.be.calledWith(BEACON_SEARCH, {
        results,
        origin: { [origin]: true },
      });
    });
  });
});
