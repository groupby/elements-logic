import { AssertTypesEqual, expect } from '../../utils';
import SaytPlugin, { SaytPluginOptions } from '../../../src/sayt-plugin';
import { SaytPlugin as SaytExport, SaytPluginOptions as SaytPluginOptionsExport } from '../../../src/index';

describe('Entry point', () => {
  it('should export SaytPlugin', () => {
    expect(SaytPlugin).to.equal(SaytExport);
  });

  it('should export the SaytPluginOptions interface', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const test: AssertTypesEqual<SaytPluginOptionsExport, SaytPluginOptions> = true;
  });
});
