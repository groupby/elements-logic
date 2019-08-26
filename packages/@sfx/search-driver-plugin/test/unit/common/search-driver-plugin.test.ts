import { expect, spy, stub } from '../../utils';
import SearchDriverPlugin from '@sfx/search-driver-plugin/src/search-driver-plugin';
import { SEARCH_REQUEST_EVENT, SEARCH_RESPONSE_EVENT, SEARCH_ERROR_EVENT } from '@sfx/search-driver-plugin/src/events';

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

      expect(registerListener).to.be.calledWith(SEARCH_REQUEST_EVENT, searchDriverPlugin.fetchSearchData);
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

      expect(unregisterListener).to.be.calledWith(SEARCH_REQUEST_EVENT, searchDriverPlugin.fetchSearchData);
    });
  });

  describe('fetchSearchData()', () => {
    it('should search with the given search term', () => {
      const searchTerm = 'search term';
      const sendSearchApiRequest = stub(searchDriverPlugin, 'sendSearchApiRequest').resolves();
      searchDriverPlugin.core = {
        [eventsPluginName]: { dispatchEvent: () => {} },
      };

      searchDriverPlugin.fetchSearchData({detail: { value: searchTerm } } as any);

      expect(sendSearchApiRequest).to.be.calledWith(searchTerm);
    });

    it('should dispatch an event with the results', (done) => {
      const results = { a: 'a' };
      const dispatchEvent = spy(() => {
        expect(dispatchEvent).to.be.calledWith(SEARCH_RESPONSE_EVENT, results);
        done();
      });
      const sendSearchApiRequest = stub(searchDriverPlugin, 'sendSearchApiRequest').resolves(results);
      searchDriverPlugin.core = {
        [eventsPluginName]: { dispatchEvent },
      };

      searchDriverPlugin.fetchSearchData({ detail: 'search' } as any);
    });

    it('should dispatch an error event when the search fails', (done) => {
      const error = new Error('error-object');
      const sendSearchApiRequest = stub(searchDriverPlugin, 'sendSearchApiRequest').rejects(error);
      const dispatchEvent = spy(() => {
        expect(dispatchEvent).to.be.calledWith(SEARCH_ERROR_EVENT, error);
        done();
      });
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
      search.withArgs(query).returns(results);
      searchDriverPlugin.core = { search: { search } };

      const retval = searchDriverPlugin.sendSearchApiRequest(query);

      expect(retval).to.equal(results);
    });
  });
});
