import { expect } from 'chai';
import { checkDependencies } from '../../../../src/utils/core';

describe('CoreUtils', () => {
  describe('checkDependencies()', () => {
    it('should be callable', () => {
      expect(checkDependencies).to.be.a('function');
    });
  });
});
