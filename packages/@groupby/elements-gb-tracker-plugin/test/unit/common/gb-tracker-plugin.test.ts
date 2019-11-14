import * as GbTrackerPackage from 'gb-tracker-client';
import { expect, stub } from '../../utils';
import GbTrackerPlugin, { TrackerPluginOptions } from '../../../src/gb-tracker-plugin';

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
      expect(trackerPlugin.metadata.depends).to.deep.equal([]);
    });
  });

  describe('constructor()', () => {
    it('should create a new instance of GbTracker with options', () => {
      const gbTrackerInstance = { a: 'a' };
      console.log("================");
      console.log(GbTrackerPackage);
      const GbTracker = stub(GbTrackerPackage, 'constructor').returns(gbTrackerInstance);
      const options: any = { customerId: 'my-customer-id', b: 'b' };

      trackerPlugin = new GbTrackerPlugin(options);

      expect(GbTracker).to.be.calledWith(options);
      expect(GbTracker.calledWithNew()).to.be.true;
      expect(trackerPlugin.gbTracker).to.equal(gbTrackerInstance);
    });
  });

  // describe('register()', () => {
  //   it('should return the gb-tracker instance', () => {
  //     const gbTrackerInstance = trackerPlugin.gbTracker = { a: 'a' };
  //     const registerReturnValue = trackerPlugin.register();

  //     expect(registerReturnValue).to.equal(gbTrackerInstance);
  //   });
  // });
});
