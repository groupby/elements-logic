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
  const customerId = 'custid';
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
    const returnedCore = quickStart({ customerId });

    expect(CoreStub.calledWithNew()).to.be.true;
    expect(returnedCore).to.equal(core);
  });

  it('should instantiate plugins', () => {
    quickStart({ customerId });

    expect(CachePlugin.calledWithNew()).to.be.true;
    expect(CacheDriverPlugin.calledWithNew()).to.be.true;
    expect(DomEventsPlugin.calledWithNew()).to.be.true;
    expect(SaytPlugin.calledWithNew()).to.be.true;
    expect(SaytDriverPlugin.calledWithNew()).to.be.true;
    expect(SearchPlugin.calledWithNew()).to.be.true;
    expect(SearchDriverPlugin.calledWithNew()).to.be.true;
  });

  it('should register plugins', () => {
    const cachePlugin = { cache: 'cache' };
    const cacheDriverPlugin = { cacheDriver: 'cacheDriver' };
    const domEventsPlugin = { domEvents: 'domEvents' };
    const saytPlugin = { sayt: 'sayt' };
    const saytDriverPlugin = { saytDriver: 'saytDriver' };
    const searchPlugin = { search: 'search' };
    const searchDriverPlugin = { searchDriver: 'searchDriver' };
    CachePlugin.returns(cachePlugin);
    CacheDriverPlugin.returns(cacheDriverPlugin);
    DomEventsPlugin.returns(domEventsPlugin);
    SaytPlugin.returns(saytPlugin);
    SaytDriverPlugin.returns(saytDriverPlugin);
    SearchPlugin.returns(searchPlugin);
    SearchDriverPlugin.returns(searchDriverPlugin);

    quickStart({ customerId });

    const plugins = register.firstCall.args[0];
    expect(plugins).to.have.members([
      cacheDriverPlugin,
      cachePlugin,
      domEventsPlugin,
      saytDriverPlugin,
      saytPlugin,
      searchDriverPlugin,
      searchPlugin,
    ]);
  });

  it('should forward customerId to SaytPlugin', () => {
    quickStart({ customerId });

    expect(SaytPlugin).to.be.calledWith({ subdomain: customerId });
  });

  it('should forward productTransformer to SaytPlugin', () => {

  });

  it('should forward productTransformer to SearchPlugin');
});
