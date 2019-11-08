import { expect } from '../../utils';
import { CacheDriverPlugin as CacheDriverPluginExport } from '../../../src';
import CacheDriverPlugin from '../../../src/cache-driver-plugin';

describe('Entry point', () => {
  it('should export the CacheDriverPlugin', () => {
    expect(CacheDriverPluginExport).to.equal(CacheDriverPlugin);
  });
});
