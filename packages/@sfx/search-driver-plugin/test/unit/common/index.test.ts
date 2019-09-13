import { expect } from '../../utils';
// eslint-disable-next-line
import { default as SearchDriverPlugin } from '../../../src/search-driver-plugin';
import { SearchDriverPlugin as SearchDriverExport } from '../../../src/index';

describe('Entry point', () => {
  it('should export SearchDriverPlugin', () => {
    expect(SearchDriverExport).to.equal(SearchDriverPlugin);
  });
});
