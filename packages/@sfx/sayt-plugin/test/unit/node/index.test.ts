import { expect } from 'chai';
import { stub } from 'sinon';
import * as Sample from '../../../src';

describe('Test Import', () => {
  let testData: Sample.DummyInterface = {
    label: 'test',
    number: 6,
  };
  it('should return the label string capitalized', () => {
    expect(Sample.testFunc(testData)).to.equal('TEST');
  });
  it('should call a function to get the label value', () => {
    const getLabelStub = stub(Sample, 'getLabel').callThrough();
    Sample.testFunc(testData);
    expect(getLabelStub.callCount).to.equal(1);
  });
});
