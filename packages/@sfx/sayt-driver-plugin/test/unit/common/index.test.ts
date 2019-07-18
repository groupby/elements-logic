import { AssertTypesEqual, expect } from '../../utils';
import {
  SaytDriverPlugin as SaytDriverPluginExport,
  QueryTimeAutocompleteConfigWithQuery as QueryTimeAutocompleteConfigWithQueryExport,
} from '../../../src';
import {
  default as SaytDriverPlugin,
  QueryTimeAutocompleteConfigWithQuery,
} from '../../../src/sayt-driver-plugin';


describe('Entry point', () => {
  it('should export EventsBrowserPlugin ', () => {
    expect(SaytDriverPluginExport).to.equal(SaytDriverPlugin);
  });
  it('should export the QueryTimeAutocompleteConfigWithQuery interface', () => {
    const test: AssertTypesEqual<QueryTimeAutocompleteConfigWithQueryExport, QueryTimeAutocompleteConfigWithQuery> = true;
  });
});
