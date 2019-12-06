import { expect } from '../../utils';
import GbTrackerPlugin from '../../../src/gb-tracker-plugin';
import { GbTrackerPlugin as GbTrackerExport } from '../../../src/index';

describe('Entry point', () => {
  it('should export GbTrackerPlugin', () => {
    expect(GbTrackerPlugin).to.equal(GbTrackerExport);
  });
});
