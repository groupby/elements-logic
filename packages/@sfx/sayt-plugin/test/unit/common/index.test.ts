import { expect, stub } from '../../utils';
import * as Sample from '../../../src';

describe('Test Import Common', () => {
  let testData: Sample.DummyInterface = {
    label: 'test',
    number: 6,
  };
  it('should return the label string capitalized', () => {
    expect(Sample.testFunc(testData)).to.equal('TEST');
  });
  it('should call a function to get the label value', () => {
    const getLabelStub = stub(Sample, 'getLabel').returns('other return string');
    Sample.testFunc(testData);
    expect(getLabelStub).to.be.calledOnce;
  });
  it('test', () => {
    expect(Sample.getLabel(testData)).to.equal('test');
  });
});
