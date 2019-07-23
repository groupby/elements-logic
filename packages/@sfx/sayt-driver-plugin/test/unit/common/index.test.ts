import { AssertTypesEqual, expect } from '../../utils';
import {
  AutocompleteConfig as AutocompleteConfigExport,
  AutocompleteResponseSection as AutocompleteResponseSectionExport,
  SaytDriverPlugin as SaytDriverPluginExport,
  SearchTermItem as SearchTermItemExport,
} from '../../../src';
import {
  default as SaytDriverPlugin,
  AutocompleteConfig,
  AutocompleteResponseSection,
  SearchTermItem,
} from '../../../src/sayt-driver-plugin';


describe('Entry point', () => {
  it('should export the SaytDriverPlugin', () => {
    expect(SaytDriverPluginExport).to.equal(SaytDriverPlugin);
  });

  it('should export the AutocompleteConfig interface', () => {
    const test: AssertTypesEqual<AutocompleteConfigExport, AutocompleteConfig> = true;
  });

  it('should export the AutocompleteResponseSection interface', () => {
    const test: AssertTypesEqual<AutocompleteResponseSectionExport, AutocompleteResponseSection> = true;
  });

  it('should export the SearchTermItem interface', () => {
    const test: AssertTypesEqual<SearchTermItemExport, SearchTermItem> = true;
  });
});
