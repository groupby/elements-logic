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

    it('should return no missing dependencies when all are met', () => {
      const available = ['a', 'b', 'c'];
      const required = ['a', 'b'];

      const missing = getMissingDependencies(available, required);

      expect(missing).to.eql([]);
    });

    it('should return no missing dependencies when there are no dependencies', () => {
      const available = ['a', 'b', 'c'];
      const required = [];

      const missing = getMissingDependencies(available, required);

      expect(missing).to.eql([]);
    });
  });
});
