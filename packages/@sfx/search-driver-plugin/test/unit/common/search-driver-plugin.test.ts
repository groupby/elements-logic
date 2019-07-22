import { expect, sinon, stub } from '../../utils';
import SearchDriverPlugin from '../../../src/search-driver-plugin';
import * as SearchDriverPackage from 'sayt';

describe('SearchDriverPlugin', () => {
  let searchDriverPlugin: any;

  beforeEach(() => {
    searchDriverPlugin = new SearchDriverPlugin();
  });

  describe('metadata getter', () => {
    it('should have the name `sayt`', () => {
      expect(searchDriverPlugin.metadata.name).to.equal('search-driver');
    });

    it('should not specify any dependencies', () => {
      expect(searchDriverPlugin.metadata.depends).to.deep.equal([
        'dom_events',
        'search_data_source',
      ]);
    });
  });

  describe('constructor()', () => {
    it('should accept an options object', () => {
      const callback = () => {
        searchDriverPlugin = new SearchDriverPlugin({ 'a': 1, 'b': 2});
      }

      expect(callback).not.to.throw();
    });
  });

  describe('register()', () => {
    it('should save the plugin registry for future use', () => {
      const registry = { 'a': 1, 'b': 2} as any;

      searchDriverPlugin.register(registry);

      expect(searchDriverPlugin.core).to.equal(registry);
    });
  });

  describe('ready()', () => {
    it('should exist as a function', () => {
      expect(searchDriverPlugin.ready).to.be.a('function');
    });
  });
});
