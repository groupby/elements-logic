import * as Cache from '@groupby/elements-cache-plugin';
import * as CacheDriver from '@groupby/elements-cache-driver-plugin';
import * as Core from '@groupby/elements-core';
import * as DomEvents from '@groupby/elements-dom-events-plugin';
import * as Sayt from '@groupby/elements-sayt-plugin';
import * as SaytDriver from '@groupby/elements-sayt-driver-plugin';
import * as Search from '@groupby/elements-search-plugin';
import * as SearchDriver from '@groupby/elements-search-driver-plugin';
import { expect, spy, stub } from '../../utils';
import quickStart from '../../../src/quick-start';

describe('quickStart()', () => {
  let CoreStub;
  let CachePlugin;
  let CacheDriverPlugin;
  let DomEventsPlugin;
  let SaytPlugin;
  let SaytDriverPlugin;
  let SearchPlugin;
  let SearchDriverPlugin;
  let core;
  let register;

  beforeEach(() => {
    register = spy();
    core = { register };
    CoreStub = stub(Core, 'Core').returns(core);
    CachePlugin = stub(Cache, 'CachePlugin');
    CacheDriverPlugin = stub(CacheDriver, 'CacheDriverPlugin');
    DomEventsPlugin = stub(DomEvents, 'DomEventsPlugin');
    SaytPlugin = stub(Sayt, 'SaytPlugin');
    SaytDriverPlugin = stub(SaytDriver, 'SaytDriverPlugin');
    SearchPlugin = stub(Search, 'SearchPlugin');
    SearchDriverPlugin = stub(SearchDriver, 'SearchDriverPlugin');
  });

  it('should return an instance of Core', () => {
    const returnedCore = quickStart();

    expect(CoreStub.calledWithNew()).to.be.true;
    expect(returnedCore).to.equal(core);
  });

  it('should instantiate plugins', () => {
    quickStart();

    expect(CachePlugin.calledWithNew()).to.be.true;
    expect(CacheDriverPlugin.calledWithNew()).to.be.true;
    expect(DomEventsPlugin.calledWithNew()).to.be.true;
    expect(SaytPlugin.calledWithNew()).to.be.true;
    expect(SaytDriverPlugin.calledWithNew()).to.be.true;
    expect(SearchPlugin.calledWithNew()).to.be.true;
    expect(SearchDriverPlugin.calledWithNew()).to.be.true;
  });

  it('should registers plugins');
  it('should forward customerId to SaytPlugin');
  it('should forward productTransformer to SaytPlugin');
  it('should forward productTransformer to SearchPlugin');
});
