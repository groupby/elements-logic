import { AssertTypesEqual, expect } from '../../utils';
import { default as SearchPlugin } from '../../../src/search-plugin';
import {
  SearchPlugin as SearchPluginExport,
  SearchPluginExposedValue as SearchPluginExposedValueExport,
  SearchPluginOptions as SearchPluginOptionsExport,
 } from '../../../src/index';
import { SearchPluginExposedValue, SearchPluginOptions } from '../../../src/search-plugin';

describe('Entry point', () => {
  it('should export SearchPlugin', () => {
    expect(SearchPlugin).to.equal(SearchPluginExport);
  });

  it('should export the SearchPluginExposedValue interface', () => {
    const test: AssertTypesEqual<SearchPluginExposedValueExport , SearchPluginExposedValue> = true;
  });

  it('should export the SearchPluginOptions interface', () => {
    const test: AssertTypesEqual<SearchPluginOptionsExport , SearchPluginOptions> = true;
  });
});
