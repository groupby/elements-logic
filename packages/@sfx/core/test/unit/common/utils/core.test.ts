import { expect } from 'chai';
import { checkDependencies } from '../../../../src/utils/core';

describe('CoreUtils', () => {
  describe('checkDependencies()', () => {
    it('should raise an error if there are missing dependencies', () => {
      const available = ['a', 'b', 'c'];
      const required = ['a', 'b', 'd'];

      expect(() => checkDependencies(available, required)).to.throw();
    });
  });
});
