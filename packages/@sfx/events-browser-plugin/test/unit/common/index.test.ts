import { expect } from '../../utils';
import { EventsBrowserPlugin as EventsBrowserPluginExport} from '../../../src';
import EventsBrowserPlugin from '../../../src/events-browser-plugin';

describe('Entry point', () => {
  it('should export EventsBrowserPlugin ', () => {
    expect(EventsBrowserPluginExport).to.equal(EventsBrowserPlugin);
  });
});
