import { expect } from 'chai';
import { spy } from 'sinon';
import Core from '../../../src/core';

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

  // describe('register()', () => {
  //   it('should throw if dependencies are not met', () => {

  //   });
  // })
});
