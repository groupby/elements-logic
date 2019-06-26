import { expect } from 'chai';
import { testFunc, DummyInterface } from '../../../src'

describe('Dummy test', () => {
  it('should pass', () => {
    expect(true).to.be.true;
  });
});

describe('Test Import', () => {
  it('should return a string', () => {
    let testObj: DummyInterface = {
      label: 'test'
    };
    expect(testFunc(testObj)).to.equal('test');
  });
});
