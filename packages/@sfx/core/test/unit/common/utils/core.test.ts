import { expect } from 'chai';
import { getMissingDependencies } from '../../../../src/utils/core';

describe('CoreUtils', () => {
  describe('getMissingDependencies()', () => {
    it('should return missing dependencies', () => {
      const available = ['a', 'b', 'c'];
      const required = ['a', 'd', 'b', 'e'];

      const missing = getMissingDependencies(available, required);

      expect(missing).to.have.members(['d', 'e']);
    });
  });
});
