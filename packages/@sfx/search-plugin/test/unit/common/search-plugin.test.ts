import { expect, sinon, stub } from '../../utils';
import SearchPlugin from '../../../src/search-plugin';
import { BridgeConfig, Query } from 'groupby-api';
import * as SearchPackage from 'groupby-api';

describe('SearchPlugin', () => {
  let searchPlugin: any;

  beforeEach(() => {
    searchPlugin = new SearchPlugin('testClientId', true);
  });

  describe('metadata getter', () => {
    it('should have the name `search-data-source`', () => {
      expect(searchPlugin.metadata.name).to.equal('search-data-source');
    });

    it('should not specify any dependencies', () => {
      expect(searchPlugin.metadata.depends).to.deep.equal([]);
    });
  });

  describe('constructor()', () => {
    it('should create a new instance of Search BrowserBridge with options', () => {
      const browserBridgeInstance = { a: 'a' };
      const SearchBrowserBridge = stub(SearchPackage, 'BrowserBridge').returns(browserBridgeInstance);
      const clientId = 'testClientId';
      const https = true;
      const options: BridgeConfig = {
        timeout: 2000,
      };

      searchPlugin = new SearchPlugin(clientId, https, options);

      expect(SearchBrowserBridge).to.be.calledWith(clientId, https, options);
      expect(SearchBrowserBridge.calledWithNew()).to.be.true;
      expect(searchPlugin.browserBridge).to.equal(browserBridgeInstance);
    });
  });

  describe('register()', () => {
    it('should return the search data source browser bridge instance', () => {
      const browserBridgeInstance = searchPlugin.browserBridge = { a: 'a' };
      const registerReturnValue = searchPlugin.register();
      expect(registerReturnValue).to.equal(browserBridgeInstance);
    });

  });

});
