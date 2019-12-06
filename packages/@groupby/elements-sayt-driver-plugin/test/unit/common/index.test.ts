import { AssertTypesEqual, expect } from '../../utils';
import { SaytDriverPlugin as SaytDriverPluginExport, SaytDriverOptions as SaytDriverOptionsExport } from '../../../src';
import SaytDriverPlugin, { SaytDriverOptions } from '../../../src/sayt-driver-plugin';

describe('Entry point', () => {
  it('should export the SaytDriverPlugin', () => {
    expect(SaytDriverPluginExport).to.equal(SaytDriverPlugin);
  });

  it('should export the SaytDriverOptions interface', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const test: AssertTypesEqual<SaytDriverOptionsExport<{}>, SaytDriverOptions<{}>> = true;
  });
});
