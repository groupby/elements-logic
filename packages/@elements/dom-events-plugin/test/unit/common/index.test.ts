import { AssertTypesEqual, expect } from '../../utils';
import {
  DomEventsPlugin as DomEventsPluginExport,
  DomEventsPluginOptions as DomEventsPluginOptionsExport,
  DomEventsPluginExposedValue as DomEventsPluginExposedValueExport,
} from '../../../src';
import DomEventsPlugin, { DomEventsPluginOptions, DomEventsPluginExposedValue } from '../../../src/dom-events-plugin';


describe('Entry point', () => {
  it('should export DomEventsPlugin ', () => {
    expect(DomEventsPluginExport).to.equal(DomEventsPlugin);
  });

  it('should export the DomEventsPluginOptions interface', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const test: AssertTypesEqual<DomEventsPluginOptionsExport, DomEventsPluginOptions> = true;
  });

  it('should export the DomEventsPluginExposedValue interface', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const test: AssertTypesEqual<DomEventsPluginExposedValueExport, DomEventsPluginExposedValue> = true;
  });
});
