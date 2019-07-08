import { expect } from '../../utils';
import { DomEventsPlugin as DomEventsPluginExport} from '../../../src';
import DomEventsPlugin from '../../../src/dom-events-plugin';

describe('Entry point', () => {
  it('should export DomEventsPlugin ', () => {
    expect(DomEventsPluginExport).to.equal(DomEventsPlugin);
  });
});
