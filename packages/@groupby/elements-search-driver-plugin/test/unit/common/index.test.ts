import { AssertTypesEqual, expect } from '../../utils';
import SearchDriverPlugin, { SearchDriverOptions } from '../../../src/search-driver-plugin';
import {
  SearchDriverPlugin as SearchDriverExport,
  SearchDriverOptions as SearchDriverOptionsExport,
} from '../../../src/index';

describe('Entry point', () => {
  it('should export SearchDriverPlugin', () => {
    expect(SearchDriverExport).to.equal(SearchDriverPlugin);
  });

  it('should export the SearchDriverOptions interface', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const test: AssertTypesEqual<SearchDriverOptionsExport<{}>, SearchDriverOptions<{}>> = true;
  });
});
