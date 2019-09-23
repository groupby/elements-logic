import { expect } from '../../utils';
import SearchDriverPlugin from '../../../src/search-driver-plugin';
import { SearchDriverPlugin as SearchDriverExport } from '../../../src/index';

describe('Entry point', () => {
  it('should export SearchDriverPlugin', () => {
    expect(SearchDriverExport).to.equal(SearchDriverPlugin);
  });
});
