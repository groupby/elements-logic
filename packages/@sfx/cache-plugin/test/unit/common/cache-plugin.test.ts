import { expect, spy, stub } from '../../utils';
import CachePlugin from '../../../src/cache-plugin';

describe('CachePlugin', () => {
  let cachePlugin;

  beforeEach(() => {
    cachePlugin = new CachePlugin();
  });

  describe('metadata getter', () => {
    it('should have the name `cache`', () => {
      expect(cachePlugin.metadata.name).to.equal('cache');
    });

    it('should specify no dependencies', () => {
      expect(cachePlugin.metadata.depends).to.deep.equal([]);
    });
  });

  describe('constructor()', () => {
    it('should create an empty map by default', () => {
      expect(cachePlugin.store).to.be.a('Map').that.is.empty;
    });

    it('should accept an initial store', () => {
      const store = new Map([['a', 1]]);

      cachePlugin = new CachePlugin({ store });

      expect(cachePlugin.store).to.equal(store);
    });
  });

  describe('register()', () => {
    it('should return the stored Map', () => {
      const store = cachePlugin.store = new Map([['a', 1]]);

      const cache = cachePlugin.register();

      expect(cache).to.equal(store);
    });
  });
});
