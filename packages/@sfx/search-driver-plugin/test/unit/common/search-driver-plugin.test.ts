import { expect, spy, stub } from '../../utils';
import { SEARCH_REQUEST, SEARCH_RESPONSE, SEARCH_ERROR } from '@sfx/events';
import SearchDriverPlugin from '@sfx/search-driver-plugin/src/search-driver-plugin';

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
    let results;
    let group;
    let sendSearchApiRequest;

    beforeEach(() => {
      results = { a: 'a' };
      group = undefined;
      sendSearchApiRequest = stub(searchDriverPlugin, 'sendSearchApiRequest');
    });

    it('should search with the given search term', () => {
      const searchTerm = 'search term';
      sendSearchApiRequest.resolves();
      searchDriverPlugin.core = {
        [eventsPluginName]: { dispatchEvent: () => {} },
      };

      searchDriverPlugin.fetchSearchData({ detail: { value: searchTerm } } as any);

      expect(sendSearchApiRequest).to.be.calledWith(searchTerm);
    });

    it('should dispatch an event with the results and the group if present', (done) => {
      const dispatchEvent = spy(() => {
        expect(dispatchEvent).to.be.calledWith(SEARCH_RESPONSE, { results, group });
        done();
      });
      group = 'group';
      sendSearchApiRequest.resolves(results);
      searchDriverPlugin.core = {
        [eventsPluginName]: { dispatchEvent },
      };

      searchDriverPlugin.fetchSearchData({ detail: { value: 'search', group } } as any);
    });

    it('should send an undefined group if one is not provided', (done) => {
      const dispatchEvent = spy(() => {
        expect(dispatchEvent).to.be.calledWith(SEARCH_RESPONSE, { results, group });
        done();
      });
      sendSearchApiRequest.resolves(results);
      searchDriverPlugin.core = {
        [eventsPluginName]: { dispatchEvent },
      };

      searchDriverPlugin.fetchSearchData({ detail: { value: 'search' } } as any);
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
  });

  describe('sendSearchApiRequest()', () => {
    it('should forward the query to the search plugin', () => {
      const query = 'search term';
      const results = Promise.resolve({});
      const search = stub();
      search.withArgs({
        fields: ['*'],
        query,
      }).returns(results);
      searchDriverPlugin.core = { search: { search } };

      const retval = searchDriverPlugin.sendSearchApiRequest(query);

      expect(retval).to.equal(results);
    });
  });
});
