import { AssertTypesEqual, expect } from '../../utils';
import GbTrackerPlugin, { GbTrackerPluginOptions } from '../../../src/gb-tracker-plugin';
import {
  GbTrackerPlugin as GbTrackerPluginExport,
  GbTrackerPluginOptions as GbTrackerOptionsExport,
} from '../../../src/index';

describe('Entry point', () => {
  it('should export GbTrackerPlugin', () => {
    expect(GbTrackerPlugin).to.equal(GbTrackerPluginExport);
  });

  it('should export GbTrackerPluginOptions', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const test: AssertTypesEqual<GbTrackerOptionsExport, GbTrackerPluginOptions> = true;
  });
});
