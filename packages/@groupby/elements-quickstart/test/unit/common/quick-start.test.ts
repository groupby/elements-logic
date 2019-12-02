import * as Core from '@groupby/elements-core';
import { expect, stub } from '../../utils';
import quickStart from '../../../src/quick-start';

describe('quickStart()', () => {
  it('should return an instance of Core', () => {
    const core = { a: 'a' };
    const CoreStub = stub(Core, 'Core').returns(core);

    const returnedCore = quickStart();

    expect(CoreStub.calledWithNew()).to.be.true;
    expect(returnedCore).to.equal(core);
  });

  it('should registers plugins');
  it('should forward customerId to SaytPlugin');
  it('should forward productTransformer to SaytPlugin');
  it('should forward productTransformer to SearchPlugin');
});
