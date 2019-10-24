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
  });

  describe('register()', () => {
  });
});
