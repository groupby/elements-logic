import { expect } from '../../utils';
import { default as SearchPlugin } from '../../../src/search-plugin';
import { SearchPlugin as SearchExport } from '../../../src/index';

describe('Entry point', () => {
  it('should export SearchPlugin', () => {
    expect(SearchPlugin).to.equal(SearchExport);
  });
});
