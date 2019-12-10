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
  let productTransformer;
  let options: any;

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
    productTransformer = spy();
    options = { a: 'a' };
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

  it('should forward customerId and options to the SaytPlugin', () => {
    quickStart({ customerId, pluginOptions: { sayt: options } });

    expect(SaytPlugin).to.be.calledWith({ ...options, subdomain: customerId });
  it('should pass the customerId from the sayt plugin options if it exists instead of the general one', () => {
    options.subdomain = 'options custid';

    quickStart({ customerId, pluginOptions: { sayt: options } });

    expect(SaytPlugin).to.be.calledWithExactly(options);
  });

  it('should forward customerId and options to the SearchPlugin', () => {
    quickStart({ customerId, pluginOptions: { search: options } });

    expect(SearchPlugin).to.be.calledWith({ ...options, customerId });
  });

  it('should pass the customerId from the search plugin options if it exists instead of the general one', () => {
    options.customerId = 'options custid';

    quickStart({ customerId, pluginOptions: { search: options } });

    expect(SearchPlugin).to.be.calledWithExactly(options);
  });

  it('should forward productTransformer to SaytDriverPlugin', () => {
    quickStart({ customerId, productTransformer });

    expect(SaytDriverPlugin).to.be.calledWith({ productTransformer });
  });

  it('should forward options to the SaytDriverPlugin', () => {
    quickStart({ customerId, pluginOptions: { sayt_driver: options } });

    expect(SaytDriverPlugin).to.be.calledWith(options);
  });

  it('should pass the productTransformer from the sayt driver options if it exists instead of the general one', () => {
    options.productTransformer = spy();

    quickStart({ customerId, productTransformer, pluginOptions: { sayt_driver: options } });

    expect(SaytDriverPlugin).to.be.calledWith(options);
  });

  it('should forward productTransformer to SearchDriverPlugin', () => {
    quickStart({ customerId, productTransformer });

    expect(SearchDriverPlugin).to.be.calledWith({ productTransformer });
  });

  it('should forward options to the SearchDriverPlugin', () => {
    quickStart({ customerId, pluginOptions: { search_driver: options } });

    expect(SearchDriverPlugin).to.be.calledWith(options);
  });

  it('should pass the productTransformer from the search driver options if it exists instead of the general one', () => {
    options.productTransformer = spy();

    quickStart({ customerId, productTransformer, pluginOptions: { search_driver: options } });

    expect(SearchDriverPlugin).to.be.calledWith(options);
    expect(SearchDriverPlugin).to.not.be.calledWith(productTransformer);
  });

  it('should forward cache options to the CachePlugin', () => {
    quickStart({ customerId, pluginOptions: { cache: options } });

    expect(CachePlugin).to.be.calledWith(options);
  });

  it('should forward options to the CacheDriverPlugin', () => {
    quickStart({ customerId, pluginOptions: { cache_driver: options } });

    expect(CacheDriverPlugin).to.be.calledWith(options);
  });

  it('should forward dom event options to the DomEventsPlugin', () => {
    quickStart({ customerId, pluginOptions: { dom_events: options } });

    expect(DomEventsPlugin).to.be.calledWith(options);
  });
});
