import { expect, sinon, spy, stub } from '../../utils';
import SearchDriverPlugin from '@sfx/search-driver-plugin/src/search-driver-plugin';
import { SEARCH_REQUEST_EVENT, SEARCH_RESPONSE_EVENT } from '@sfx/search-driver-plugin/src/events';
import * as SearchDriverPackage from 'sayt';

describe('SearchDriverPlugin', () => {
  let searchDriverPlugin;

  beforeEach(() => {
    searchDriverPlugin = new SearchDriverPlugin();
  });

  describe('metadata getter', () => {
    it('should have the name `search_driver`', () => {
      expect(searchDriverPlugin.metadata.name).to.equal('search_driver');
    });

    it('should specify dependencies', () => {
      expect(searchDriverPlugin.metadata.depends).to.have.members([
        'dom_events',
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
      const eventsPluginName = searchDriverPlugin.eventsPluginName = 'events-plugin';
      const searchDataEvent = searchDriverPlugin.searchDataEvent = 'search-event';
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
      const eventsPluginName = searchDriverPlugin.eventsPluginName = 'events-plugin';
      const searchDataEvent = searchDriverPlugin.searchDataEvent = 'search-event';
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
    it('should search with the given search term');
    it('should dispatch an event with the results');
    it('should dispatch an error event when the search fails');
  });
});
