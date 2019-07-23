import { expect, sinon, stub } from '../../utils';
import SearchPlugin from '../../../src/search-plugin';
import { SearchPluginOptions, SearchPluginExposedValue } from '../../../src/search-plugin';
import { BridgeConfig, Query } from 'groupby-api';
import * as SearchPackage from 'groupby-api';

describe('SearchPlugin', () => {
  let searchPlugin: any;

  beforeEach(() => {
    searchPlugin = new SearchPlugin({ customerId: 'testClientId', https: true });
  });

  describe('metadata getter', () => {
    it('should have the name `search`', () => {
      expect(searchPlugin.metadata.name).to.equal('search');
    });

    it('should not specify any dependencies', () => {
      expect(searchPlugin.metadata.depends).to.deep.equal([]);
    });
  });

  describe('constructor()', () => {
    it('should default https to true', () => {
      const defaultOptions = { customerId: 'testClientId', https: true };

      expect(searchPlugin.options).to.deep.equal(defaultOptions);
    });

    it('should throw an error if `customerId` is not passed', () => {
      const invalidOptions = { customerId: undefined };

      expect(() => new SearchPlugin(invalidOptions)).to.throw();
    });

    it('should create a new instance of Search BrowserBridge with options', () => {
      const browserBridgeInstance = { a: 'a' };
      const SearchBrowserBridge = stub(SearchPackage, 'BrowserBridge').returns(browserBridgeInstance);
      const config: BridgeConfig = {
        timeout: 2000,
      };
      const customerId = 'testClientId';
      const https = true;
      const combinedOptions = { customerId, https, ...config };

      searchPlugin = new SearchPlugin(combinedOptions);

      expect(SearchBrowserBridge).to.be.calledWith(customerId, https, config);
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
  })
});
