import { AssertTypesEqual, expect } from '../../utils';
import SaytPlugin, { SaytOptions } from '../../../src/sayt-plugin';
import { SaytPlugin as SaytExport, SaytOptions as SaytOptionsExport } from '../../../src/index';

describe('Entry point', () => {
  it('should export SaytPlugin', () => {
    expect(SaytPlugin).to.equal(SaytExport);
  });

  it('should export the SaytOptions interface', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const test: AssertTypesEqual<SaytOptionsExport, SaytOptions> = true;
  });
});
