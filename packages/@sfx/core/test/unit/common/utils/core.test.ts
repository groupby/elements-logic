import { expect } from 'chai';
import { getMissingDependencies } from '../../../../src/utils/core';

describe('CoreUtils', () => {
  describe('getMissingDependencies()', () => {
    it('should return missing dependencies', () => {
      const available = ['a', 'b', 'c'];
      const required = ['a', 'b', 'd'];

      const missing = getMissingDependencies(available, required);

      expect(missing).to.eql(['d']);
    });
  });
});
