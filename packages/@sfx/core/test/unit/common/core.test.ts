import { expect } from 'chai';
import Core from '../../../src/core';

describe('Core', () => {
  it('should be a class', () => {
    expect(Core).to.be.a('function');
  });
});
