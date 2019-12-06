import { expect, stub } from '../../utils';
import GbTrackerPlugin from '../../../src/gb-tracker-plugin';

describe('GbTrackerPlugin', () => {
  let trackerPlugin: any;

  beforeEach(() => {
    const options = {
      customerId: 'my-customer-id',
    };
    trackerPlugin = new GbTrackerPlugin(options as any);
  });

  describe('ready()', () => {
    it('should call autoSetVisitor to enable beaconing', () => {
      trackerPlugin.core = { dom_events: { registerListener: () => null } };
      const autoSetVisitor = stub(trackerPlugin.gbTracker, 'autoSetVisitor');

      trackerPlugin.ready();

      expect(autoSetVisitor).to.be.called;
    });
  });
});
