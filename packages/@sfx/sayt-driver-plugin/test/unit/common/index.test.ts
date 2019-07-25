import { AssertTypesEqual, expect } from '../../utils';
import {
  AutocompleteRequestConfig as AutocompleteRequestConfigExport,
  AutocompleteResponseSection as AutocompleteResponseSectionExport,
  SaytDriverPlugin as SaytDriverPluginExport,
  SearchTermItem as SearchTermItemExport,
} from '../../../src';
import {
  default as SaytDriverPlugin,
  AutocompleteRequestConfig,
  AutocompleteResponseSection,
  SearchTermItem,
} from '../../../src/sayt-driver-plugin';


describe('Entry point', () => {
  it('should export the SaytDriverPlugin', () => {
    expect(SaytDriverPluginExport).to.equal(SaytDriverPlugin);
  });

  it('should export the AutocompleteRequestConfig interface', () => {
    const test: AssertTypesEqual<AutocompleteRequestConfigExport, AutocompleteRequestConfig> = true;
  });

  it('should export the AutocompleteResponseSection interface', () => {
    const test: AssertTypesEqual<AutocompleteResponseSectionExport, AutocompleteResponseSection> = true;
  });

  it('should export the SearchTermItem interface', () => {
    const test: AssertTypesEqual<SearchTermItemExport, SearchTermItem> = true;
  });
});
