import {
  SEARCH_REQUEST,
  SEARCH_RESPONSE,
  SEARCH_ERROR,
  TRACKER_SEARCH,
} from '@groupby/elements-events';
import { expect, spy, stub } from '../../utils';
import SearchDriverPlugin from '../../../src/search-driver-plugin';

describe('SearchDriverPlugin', () => {
  const eventsPluginName = 'dom_events';
  let searchDriverPlugin;

  beforeEach(() => {
    searchDriverPlugin = new SearchDriverPlugin();
    searchDriverPlugin.eventsPluginName = eventsPluginName;
  });

  describe('metadata getter', () => {
    it('should have the name `search_driver`', () => {
      expect(searchDriverPlugin.metadata.name).to.equal('search_driver');
    });

    it('should specify dependencies', () => {
      expect(searchDriverPlugin.metadata.depends).to.have.members([
        eventsPluginName,
        'search',
      ]);
    });
  });

  describe('constructor()', () => {
    it('should save a passed product transformer as a transformProduct property', () => {
      const productTransformer: any = (() => 123);

      searchDriverPlugin = new SearchDriverPlugin({ productTransformer });

      expect(searchDriverPlugin.transformProduct).to.equal(productTransformer);
    });

    it('should have a default identity transformProduct property if no transformer is passed', () => {
      const object: any = { some: 'object' };
      searchDriverPlugin = new SearchDriverPlugin();

      const result = searchDriverPlugin.transformProduct(object);

      expect(result).to.equal(object);
    });
  });

  describe('register()', () => {
    it('should save the plugin registry for future use', () => {
      const registry: any = { a: 1, b: 2 };

      searchDriverPlugin.register(registry);

      expect(searchDriverPlugin.core).to.equal(registry);
    });
  });

  describe('ready()', () => {
    it('should register a search request event listener', () => {
      const registerListener = spy();
      searchDriverPlugin.core = {
        [eventsPluginName]: {
          registerListener,
        },
      };

      searchDriverPlugin.ready();

      expect(registerListener).to.be.calledWith(SEARCH_REQUEST, searchDriverPlugin.fetchSearchData);
    });
  });

  describe('unregister()', () => {
    it('should unregister the search request event listener', () => {
      const unregisterListener = spy();
      searchDriverPlugin.core = {
        [eventsPluginName]: {
          unregisterListener,
        },
      };

      searchDriverPlugin.unregister();

      expect(unregisterListener).to.be.calledWith(SEARCH_REQUEST, searchDriverPlugin.fetchSearchData);
    });
  });

  describe('fetchSearchData()', () => {
    const area = 'area';
    const collection = 'collection';
    const query = 'search term';
    let config;
    let group;
    let results;
    let sendSearchApiRequest;
    let dispatchSearchTrackerEvent;

    beforeEach(() => {
      config = { area, collection };
      group = undefined;
      results = { a: 'a' };
      searchDriverPlugin.core = {
        [eventsPluginName]: { dispatchEvent: () => {} },
      };
      sendSearchApiRequest = stub(searchDriverPlugin, 'sendSearchApiRequest');
      dispatchSearchTrackerEvent = stub(searchDriverPlugin, 'dispatchSearchTrackerEvent');
    });

    it('should search with the given search term', () => {
      const request = { query };
      sendSearchApiRequest.resolves();

      searchDriverPlugin.fetchSearchData({ detail: { query } } as any);

      expect(sendSearchApiRequest).to.be.calledWith(request);
    });

    it('should search with all provided config options', () => {
      const request = { query, area, collection };
      sendSearchApiRequest.resolves();

      searchDriverPlugin.fetchSearchData({ detail: { query, config } } as any);

      expect(sendSearchApiRequest).to.be.calledWith(request);
    });

    it('should cache the payload', () => {
      const set = spy();
      sendSearchApiRequest.resolves(results);
      searchDriverPlugin.core.cache = { set };

      searchDriverPlugin.fetchSearchData({ detail: { query, ...config } } as any);

      return expect(Promise.resolve(set))
        .to.be.eventually.calledOnceWith(`${SEARCH_RESPONSE}::${group}`, { ...results, group });
    });

    it('should dispatch an event with the results and the group if present', (done) => {
      const dispatchEvent = spy(() => {
        expect(dispatchEvent).to.be.calledWith(SEARCH_RESPONSE, { ...results, group });
        done();
      });
      group = 'group';
      sendSearchApiRequest.resolves(results);
      searchDriverPlugin.core = {
        [eventsPluginName]: { dispatchEvent },
      };

      searchDriverPlugin.fetchSearchData({ detail: { query: 'search', group } } as any);
    });

    it('should send an undefined group if one is not provided', (done) => {
      const dispatchEvent = spy(() => {
        expect(dispatchEvent).to.be.calledWith(SEARCH_RESPONSE, { ...results, group });
        done();
      });
      sendSearchApiRequest.resolves(results);
      searchDriverPlugin.core = {
        [eventsPluginName]: { dispatchEvent },
      };

      searchDriverPlugin.fetchSearchData({ detail: { query: 'search' } } as any);
    });

    it('should dispatch an error event when the search fails', (done) => {
      const error = new Error('error-object');
      const dispatchEvent = spy(() => {
        expect(dispatchEvent).to.be.calledWith(SEARCH_ERROR, { error, group });
        done();
      });
      sendSearchApiRequest.rejects(error);
      searchDriverPlugin.core = {
        [eventsPluginName]: { dispatchEvent },
      };

      searchDriverPlugin.fetchSearchData({ detail: 'search' } as any);
    });

    it.skip('should dispatch a search tracker event when the search succeeds', (done) => {
      const dispatchSearchTrackerEvent = stub(searchDriverPlugin, 'dispatchSearchTrackerEvent');
      results = {
        originalResponse: {
          id: 'search-id',
        },
      };
      sendSearchApiRequest.resolves(results);
      searchDriverPlugin.core = {
        [eventsPluginName]: { dispatchEvent: () => null },
      };

      searchDriverPlugin.fetchSearchData({ detail: { query: 'search' } } as any);

      return expect(dispatchSearchTrackerEvent).to.eventually.be.calledWith(results.originalResponse);
    });
  });

  describe('sendSearchApiRequest()', () => {
    it('should forward the query and all provided config options to the search plugin', () => {
      const query = 'search term';
      const area = 'area';
      const collection = 'collection';
      const request = { query, area, collection };
      const results = Promise.resolve({ search: 'results' });
      const searchCallbackResponse = {
        originalResponse: { full: 'response' },
        products: ['product 1', 'product 2'],
      };
      stub(searchDriverPlugin, 'searchCallback').returns(searchCallbackResponse);
      const search = stub();
      search.withArgs({
        fields: ['*'],
        query,
        area,
        collection,
      }).returns(results);
      searchDriverPlugin.core = { search: { search } };

      const result = searchDriverPlugin.sendSearchApiRequest(request);

      return expect(result).to.eventually.equal(searchCallbackResponse);
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
      const result = searchDriverPlugin.searchCallback(response);

      expect(result.products).to.have.lengthOf(2);
      expect(result.products[0].allMeta.title).to.equal(firstProductTitle);
      expect(result.products[1].allMeta.title).to.equal(secondProductTitle);
    });

    it('should map products using the transform function', () => {
      const key2 = 'value2';
      searchDriverPlugin.transformProduct = (product) => ({
        key1: product.allMeta.title,
        key2,
      });

      const result = searchDriverPlugin.searchCallback(response);

      expect(result.products).to.deep.equal([
        { key1: firstProductTitle, key2 },
        { key1: secondProductTitle, key2 },
      ]);
    });

    it('should filter out any products that map to falsy', () => {
      searchDriverPlugin.transformProduct = (product, i) => {
        if (i === 1) return undefined;
        return {
          key1: product.allMeta.title,
        };
      };

      const result = searchDriverPlugin.searchCallback(response);

      expect(result.products).to.have.lengthOf(1);
      expect(result.products[0].key1).to.equal(firstProductTitle);
    });
  });

  describe('dispatchSearchTrackerEvent()',  () => {
    it('should dispatch a TRACKER_SEARCH event given a search response', () => {
      const results = { some: 'data' };
      const dispatchEvent = spy();
      const core = {
        [eventsPluginName]: {
          dispatchEvent,
        },
      };
      searchDriverPlugin.core = core;

      searchDriverPlugin.dispatchSearchTrackerEvent(results);

      expect(dispatchEvent).to.be.calledWith(TRACKER_SEARCH, {
        results,
        origin: {
          autosearch: true,
          search: true,
        },
      });
    });
  });
});
