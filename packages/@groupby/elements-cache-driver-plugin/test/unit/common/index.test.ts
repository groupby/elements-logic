import { AssertTypesEqual, expect } from '../../utils';
import {
  CacheDriverPlugin as CacheDriverPluginExport,
  CacheDriverOptions as CacheDriverOptionsExport
} from '../../../src';
import CacheDriverPlugin, { CacheDriverOptions } from '../../../src/cache-driver-plugin';

describe('Entry point', () => {
  it('should export the CacheDriverPlugin', () => {
    expect(CacheDriverPluginExport).to.equal(CacheDriverPlugin);
  });

  it('should export the CacheDriverOptions interface', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const test: AssertTypesEqual<CacheDriverOptionsExport, CacheDriverOptions> = true;
  });
});
