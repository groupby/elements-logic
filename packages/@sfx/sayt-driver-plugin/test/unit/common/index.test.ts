import { AssertTypesEqual, expect } from '../../utils';
import {
  AutocompleteResponseSection as AutocompleteResponseSectionExport,
  SaytDriverPlugin as SaytDriverPluginExport,
  SearchTermItem as SearchTermItemExport,
  QueryTimeAutocompleteConfigWithQuery as QueryTimeAutocompleteConfigWithQueryExport,
} from '../../../src';
import {
  default as SaytDriverPlugin,
  SearchTermItem,
  AutocompleteResponseSection,
  QueryTimeAutocompleteConfigWithQuery,
} from '../../../src/sayt-driver-plugin';


describe('Entry point', () => {
  it('should export EventsBrowserPlugin ', () => {
    expect(SaytDriverPluginExport).to.equal(SaytDriverPlugin);
  });

  it('should export the SearchTermItem interface', () => {
    const test: AssertTypesEqual<SearchTermItemExport, SearchTermItem> = true;
  });

  it('should export the AutocompleteResponseSection interface', () => {
    const test: AssertTypesEqual<AutocompleteResponseSectionExport, AutocompleteResponseSection> = true;
  });

  it('should export the QueryTimeAutocompleteConfigWithQuery interface', () => {
    const test: AssertTypesEqual<QueryTimeAutocompleteConfigWithQueryExport, QueryTimeAutocompleteConfigWithQuery> = true;
  });
});
