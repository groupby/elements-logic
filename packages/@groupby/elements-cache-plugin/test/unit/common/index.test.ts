import { expect } from '../../utils';
import { CachePlugin as CachePluginExport } from '../../../src';
import CachePlugin from '../../../src/cache-plugin';

describe('Entry point', () => {
  it('should export the CachePlugin', () => {
    expect(CachePluginExport).to.equal(CachePlugin);
  });
});
