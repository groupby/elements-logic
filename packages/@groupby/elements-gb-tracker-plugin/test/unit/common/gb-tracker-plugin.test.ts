// eslint-disable-next-line import/no-unresolved
import * as GbTrackerPackage from 'gb-tracker-client/slim-es';
import { expect, stub, spy } from '../../utils';
import GbTrackerPlugin from '../../../src/gb-tracker-plugin';
import { TRACKER_SEARCH } from '@groupby/elements-events';

describe('GbTrackerPlugin', () => {
  let trackerPlugin: any;

  beforeEach(() => {
    const options = {
      customerId: 'my-customer-id',
    };
    trackerPlugin = new GbTrackerPlugin(options as any);
  });

  describe('metadata getter', () => {
    it('should have the name `gb-tracker`', () => {
      expect(trackerPlugin.metadata.name).to.equal('gb-tracker');
    });

    it('should not specify any dependencies', () => {
      expect(trackerPlugin.metadata.depends).to.deep.equal(['dom_events']);
    });
  });

  describe('constructor()', () => {
    it('should create a new instance of GbTracker with options', () => {
      const gbTrackerInstance = { a: 'a' };
      const GbTracker = stub(GbTrackerPackage, 'GbTracker').returns(gbTrackerInstance);
      const customerId = 'my-customer-id';
      const area = 'my-area';
      const overridePixelUrl = 'my-pixel-url';
      const options: any = { customerId, area, overridePixelUrl };

      trackerPlugin = new GbTrackerPlugin(options);

      expect(GbTracker).to.be.calledWith(customerId, area, overridePixelUrl);
      expect(GbTracker.calledWithNew()).to.be.true;
      expect(trackerPlugin.gbTracker).to.equal(gbTrackerInstance);
    });
  });

  describe('register()', () => {
    it('should return the gb-tracker instance', () => {
      const gbTrackerInstance = trackerPlugin.gbTracker = { a: 'a' };

      const registerReturnValue = trackerPlugin.register();

      expect(registerReturnValue).to.equal(gbTrackerInstance);
    });

    it('should set the collection of core plugins to a property', () => {
      const core = { a: 'a', b: 'b' };

      trackerPlugin.register(core);

      expect(trackerPlugin.core).to.deep.equal(core);
    });
  });

  describe('ready()', () => {
    it('should set tracker event listeners', () => {
      const registerListener = spy();
      trackerPlugin.core = { dom_events: { registerListener } };

      trackerPlugin.ready();

      expect(registerListener).to.be.calledWith(TRACKER_SEARCH, trackerPlugin.triggerSearchBeacon);
    });
  });

  describe('unregister()', () => {
    it('should unregister tracker event listeners', () => {
      const unregisterListener = spy();
      trackerPlugin.core = { dom_events: { unregisterListener } };

      trackerPlugin.unregister();

      expect(unregisterListener).to.be.calledWith(TRACKER_SEARCH, trackerPlugin.triggerSearchBeacon);
    });
  });

  describe('triggerSearchBeacon()', () => {
    it('should send an auto-search event', () => {
      const searchInfo = {
        origin: 'some-origin',
        results: { id: 'some-search-id' },
      };
      const searchTrackerEvent = { detail: searchInfo };
      const sendAutoSearchEvent = spy();
      trackerPlugin.gbTracker = { sendAutoSearchEvent };

      trackerPlugin.triggerSearchBeacon(searchTrackerEvent);

      expect(sendAutoSearchEvent).to.be.calledWith({
        search: {
          id: 'some-search-id',
          origin: 'some-origin',
        },
      });
    });
  });
});
