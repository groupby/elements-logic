import { AssertTypesEqual, expect } from '../../utils';
// eslint-disable-next-line
import { default as SearchPlugin, SearchPluginExposedValue, SearchPluginOptions } from '../../../src/search-plugin';
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
    // eslint-disable-next-line
    const test: AssertTypesEqual<SearchPluginExposedValueExport, SearchPluginExposedValue> = true;
  });

  it('should export the SearchPluginOptions interface', () => {
    // eslint-disable-next-line
    const test: AssertTypesEqual<SearchPluginOptionsExport, SearchPluginOptions> = true;
  });
});
