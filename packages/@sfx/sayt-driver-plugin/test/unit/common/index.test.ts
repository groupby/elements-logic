import { expect } from '../../utils';
import { SaytDriverPlugin as SaytDriverPluginExport } from '../../../src';
import { default as SaytDriverPlugin } from '../../../src/sayt-driver-plugin';

describe('Entry point', () => {
  it('should export the SaytDriverPlugin', () => {
    expect(SaytDriverPluginExport).to.equal(SaytDriverPlugin);
  });
});
