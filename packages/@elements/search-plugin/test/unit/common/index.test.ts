import { AssertTypesEqual, expect } from '../../utils';
// eslint-disable-next-line
import SearchPlugin, { SearchPluginExposedValue, SearchPluginOptions } from '../../../src/search-plugin';
import {
  SearchPlugin as SearchPluginExport,
  SearchPluginExposedValue as SearchPluginExposedValueExport,
  SearchPluginOptions as SearchPluginOptionsExport,
} from '../../../src/index';


describe('Entry point', () => {
  it('should export SearchPlugin', () => {
    expect(SearchPlugin).to.equal(SearchPluginExport);
  });

  it('should export the SearchPluginExposedValue interface', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const test: AssertTypesEqual<SearchPluginExposedValueExport, SearchPluginExposedValue> = true;
  });

  it('should export the SearchPluginOptions interface', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const test: AssertTypesEqual<SearchPluginOptionsExport, SearchPluginOptions> = true;
  });
});
