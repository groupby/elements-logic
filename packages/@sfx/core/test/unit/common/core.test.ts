import { expect } from 'chai';
import { spy } from 'sinon';
import Core from '../../../src/core';

describe('Core', () => {
  let core: Core;

  beforeEach(() => {
    core = new Core();
  });

  describe('constructor()', () => {
    it('should create an empty null-prototype plugins object', () => {
      expect(core.plugins).to.be.empty;
      expect(Object.getPrototypeOf(core.plugins)).to.be.null;
    });
  });

  describe('register()', () => {
    it('should call the register() function of each plugin', () => {
      const registerA = spy();
      const registerB = spy();
      const plugins = [
        { register: registerA },
        { register: registerB },
      ];

      core.register(plugins);

      expect(registerA).to.be.calledWith(core.plugins);
      expect(registerB).to.be.calledWith(core.plugins);
    });

    it('should call the register() functions of each plugin in order',() => {
      const registerA = spy();
      const registerB = spy();
      const registerC = spy();
      const plugins = [
        { register: registerA },
        { register: registerB },
        { register: registerC },
      ];

      core.register(plugins);

      expect(registerA).to.be.calledBefore(registerB);
      expect(registerB).to.be.calledBefore(registerC);
    });
  });
});
