// eslint-disable-next-line
import { BridgeConfig } from 'groupby-api';
// eslint-disable-next-line
import * as SearchPackage from 'groupby-api';
import { expect, stub } from '../../utils';
import SearchPlugin from '../../../src/search-plugin';

describe('SearchPlugin', () => {
  let searchPlugin;

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
    it('should throw an error if `customerId` is not passed', () => {
      const invalidOptions: any = {};

      expect(() => new SearchPlugin(invalidOptions)).to.throw();
    });

    it('should default https to true', () => {
      const SearchBrowserBridge = stub(SearchPackage, 'BrowserBridge');
      const customerId = 'testClientId';
      const expectedHttps = true;
      const expectedConfig = {};

      searchPlugin = new SearchPlugin({ customerId });

      expect(SearchBrowserBridge).to.be.calledWith(customerId, expectedHttps, expectedConfig);
    });

    it('should create a new instance of Search BrowserBridge with options', () => {
      const browserBridgeInstance = { a: 'a' };
      const SearchBrowserBridge = stub(SearchPackage, 'BrowserBridge').returns(browserBridgeInstance);
      const config: BridgeConfig = {
        timeout: 2000,
      };
      const customerId = 'testClientId';
      const https = false;
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
  });
});
