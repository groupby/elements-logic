// eslint-disable-next-line import/no-unresolved
import * as GbTrackerPackage from 'gb-tracker-client/slim-es';
import { BEACON_SEARCH } from '@groupby/elements-events';
import { expect, stub, spy } from '../../utils';
import GbTrackerPlugin from '../../../src/gb-tracker-plugin';

describe('GbTrackerPlugin', () => {
  let trackerPlugin: any;
  let autoSetVisitor;
  let gbTrackerInstance;
  let GbTracker;
  let sendAutoSearchEvent;

  beforeEach(() => {
    const options = {
      customerId: 'my-customer-id',
    };
    autoSetVisitor = spy();
    sendAutoSearchEvent = spy();
    gbTrackerInstance = { autoSetVisitor, sendAutoSearchEvent };
    GbTracker = stub(GbTrackerPackage, 'GbTracker').returns(gbTrackerInstance);
    trackerPlugin = new GbTrackerPlugin(options as any);
  });

  describe('metadata getter', () => {
    it('should have the name `gb-tracker`', () => {
      expect(trackerPlugin.metadata.name).to.equal('gb_tracker');
    });

    it('should not specify any dependencies', () => {
      expect(trackerPlugin.metadata.depends).to.have.members([
        'dom_events',
      ]);
    });
  });

  describe('constructor()', () => {
    it('should create a new instance of GbTracker with options', () => {
      const customerId = 'my-customer-id';
      const area = 'my-area';
      const options: any = { customerId, area };

      trackerPlugin = new GbTrackerPlugin(options);

      expect(GbTracker).to.be.calledWith(customerId, area);
      expect(GbTracker.calledWithNew()).to.be.true;
      expect(trackerPlugin.gbTracker).to.equal(gbTrackerInstance);
    });

    it('should call autoSetVisitor() on the constructed gbTracker instance', () => {
      trackerPlugin = new GbTrackerPlugin({} as any);

      expect(autoSetVisitor).to.be.called;
    });
  });

  describe('register()', () => {
    it('should return the gb-tracker instance', () => {
      const registerReturnValue = trackerPlugin.register();

      expect(registerReturnValue).to.equal(gbTrackerInstance);
    });

    it('should set the collection of core plugins to a property', () => {
      const core = { a: 'a', b: 'b' };

      trackerPlugin.register(core);

      expect(trackerPlugin.core).to.equal(core);
    });
  });

  describe('ready()', () => {
    it('should set tracker event listeners', () => {
      const registerListener = spy();
      trackerPlugin.core = { dom_events: { registerListener } };

      trackerPlugin.ready();

      expect(registerListener).to.be.calledWith(BEACON_SEARCH, trackerPlugin.triggerSearchBeacon);
    });
  });

  describe('unregister()', () => {
    it('should unregister tracker event listeners', () => {
      const unregisterListener = spy();
      trackerPlugin.core = { dom_events: { unregisterListener } };

      trackerPlugin.unregister();

      expect(unregisterListener).to.be.calledWith(BEACON_SEARCH, trackerPlugin.triggerSearchBeacon);
    });
  });

  describe('triggerSearchBeacon()', () => {
    it('should send an auto-search event', () => {
      const searchInfo = {
        origin: 'some-origin',
        results: { id: 'some-search-id' },
      };
      const searchTrackerEvent = { detail: searchInfo };

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
