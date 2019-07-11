import { AssertTypesEqual, expect } from '../../utils';
import {
  DomEventsPlugin as DomEventsPluginExport,
  DomEventsPluginOptions as DomEventsPluginOptionsExport,
  DomEventsPluginExposedValue as DomEventsPluginExposedValueExport,
} from '../../../src';
import DomEventsPlugin from '../../../src/dom-events-plugin';
import { DomEventsPluginOptions, DomEventsPluginExposedValue } from '../../../src/dom-events-plugin';

describe('Entry point', () => {
  it('should export DomEventsPlugin ', () => {
    expect(DomEventsPluginExport).to.equal(DomEventsPlugin);
  });

  it('should export the DomEventsPluginOptions interface', () => {
    const test: AssertTypesEqual<DomEventsPluginOptionsExport , DomEventsPluginOptions> = true;
  });

  it('should export the DomEventsPluginExposedValue interface', () => {
    const test: AssertTypesEqual<DomEventsPluginExposedValueExport, DomEventsPluginExposedValue> = true;
  });
});
