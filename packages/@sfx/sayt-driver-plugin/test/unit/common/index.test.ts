import { expect } from '../../utils';
import { SaytDriverPlugin as SaytDriverPluginExport } from '../../../src';
import SaytDriverPlugin from '../../../src/sayt-driver-plugin';

describe('Entry point', () => {
  it('should export EventsBrowserPlugin ', () => {
    expect(SaytDriverPluginExport).to.equal(SaytDriverPlugin);
  });
});
