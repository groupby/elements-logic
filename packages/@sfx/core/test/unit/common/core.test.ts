import { expect, sinon, spy, stub } from '../../utils';
import Core from '../../../src/core';
import * as CoreUtils from '../../../src/utils/core';

describe('Core', () => {
  let core: Core;

  beforeEach(() => {
    core = new Core();
  });

  describe('constructor()', () => {
    it('should create an empty null-prototype plugins registry object', () => {
      expect(core.plugins).to.be.empty;
      expect(Object.getPrototypeOf(core.plugins)).to.be.null;
    });
  });

  describe('register()', () => {
    let calculateMissingDependencies = stub(CoreUtils, 'calculateMissingDependencies').returns(['x']);
    let registerPlugins = stub(CoreUtils, 'registerPlugins');
    let initPlugins = stub(CoreUtils, 'initPlugins');
    let readyPlugins = stub(CoreUtils, 'readyPlugins');

    beforeEach(() => {
      calculateMissingDependencies = stub(CoreUtils, 'calculateMissingDependencies');
      registerPlugins = stub(CoreUtils, 'registerPlugins');
      initPlugins = stub(CoreUtils, 'initPlugins');
      readyPlugins = stub(CoreUtils, 'readyPlugins');
    });

    it('should throw if dependencies are not met', () => {
      const plugins: any = [
        {
          metadata: {
            name: 'a',
            depends: ['x'],
          },
        },
        {
          metadata: {
            name: 'b',
            depends: ['a'],
          },
        },
      ];
      calculateMissingDependencies.returns(['x']);
      Object.assign(core.plugins, { m: 'mm' });

      expect(() => core.register(plugins)).to.throw();
      expect(calculateMissingDependencies).to.be.calledWith(plugins, sinon.match(core.plugins));
    });

    it('should call the lifecycle events on the plugins in order', () => {
      const plugins: any = [
        {
          metadata: {
            name: 'a',
            depends: [],
          },
        },
        {
          metadata: {
            name: 'b',
            depends: [],
          },
        },
      ];
      calculateMissingDependencies.returns([]);

      core.register(plugins);

      expect(registerPlugins).to.be.calledWith(plugins, sinon.match(core.plugins));
      expect(registerPlugins).to.be.calledWith(plugins, sinon.match(core.plugins));
      expect(initPlugins).to.be.calledWith(plugins);
      expect(readyPlugins).to.be.calledWith(plugins);
      sinon.assert.callOrder(
        registerPlugins,
        initPlugins,
        readyPlugins
      );
    });
  });
});
