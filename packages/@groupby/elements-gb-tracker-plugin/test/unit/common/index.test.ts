import { AssertTypesEqual, expect } from '../../utils';
import GbTrackerPlugin, { TrackerPluginOptions } from '../../../src/gb-tracker-plugin';
import {
  GbTrackerPlugin as GbTrackerPluginExport,
  TrackerPluginOptions as GbTrackerOptionsExport,
} from '../../../src/index';

describe('Entry point', () => {
  it('should export GbTrackerPlugin', () => {
    expect(GbTrackerPlugin).to.equal(GbTrackerPluginExport);
  });

  it('should export TrackerPluginOptions', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const test: AssertTypesEqual<GbTrackerOptionsExport, TrackerPluginOptions> = true;
  });
});
