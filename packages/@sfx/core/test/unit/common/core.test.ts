import { expect } from 'chai';
import { match, spy, stub } from 'sinon';
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
      const calculateMissingDependencies = stub(CoreUtils, 'calculateMissingDependencies').returns(['x']);
      Object.assign(core.plugins, { m: 'mm' });

      expect(() => core.register(plugins)).to.throw();
      expect(calculateMissingDependencies).to.be.calledWith(plugins, match(core.plugins));
    });
  });
});
