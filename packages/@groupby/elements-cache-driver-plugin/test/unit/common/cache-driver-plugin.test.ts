import { CACHE_REQUEST } from '@groupby/elements-events';
import { expect, spy } from '../../utils';
import CacheDriverPlugin from '../../../src/cache-driver-plugin';

describe('CacheDriverPlugin', () => {
  let cacheDriverPlugin;

  beforeEach(() => {
    cacheDriverPlugin = new CacheDriverPlugin();
  });

  describe('metadata getter', () => {
    it('should have the name `cache_driver`', () => {
      expect(cacheDriverPlugin.metadata.name).to.equal('cache_driver');
    });

    it('should specify `cache` and `dom_events` as dependencies', () => {
      expect(cacheDriverPlugin.metadata.depends).to.have.members(['cache', 'dom_events']);
    });
  });

  describe('constructor()', () => {
    let defaultOptions;

    beforeEach(() => {
      defaultOptions = {};
    });

    it('should create a new instance of the CacheDriverPlugin with default options', () => {
      expect(cacheDriverPlugin.options).to.deep.equal(defaultOptions);
    });

    it('should combine the default and instance options', () => {
      const options = { a: 'a' };

      cacheDriverPlugin = new CacheDriverPlugin(options);

      expect(cacheDriverPlugin.options).to.deep.equal({ ...defaultOptions, ...options });
    });
  });

  describe('register()', () => {
    it('should save the plugin registry for future use', () => {
      const registry: any = { a: 1, b: 2 };

      cacheDriverPlugin.register(registry);

      expect(cacheDriverPlugin.core).to.equal(registry);
    });
  });

  describe('ready()', () => {
    it(`should listen for ${CACHE_REQUEST}`, () => {
      const registerListener = spy();
      cacheDriverPlugin.core = { dom_events: { registerListener } };

      cacheDriverPlugin.ready();

      expect(registerListener).to.be.calledWith(CACHE_REQUEST, cacheDriverPlugin.handleRequest);
    });
  });

  describe('handleRequest()', () => {
    const name = 'key';
    const group = 'grp';
    const returnEvent = 'ret';
    let dispatchEvent;
    let data;
    let cache;

    beforeEach(() => {
      dispatchEvent = spy();
      data = { a: 'a' };
      cache = new Map();
      cacheDriverPlugin.core = {
        cache,
        dom_events: { dispatchEvent },
      };
    });

    it('should dispatch the requested data from the cache', () => {
      const req = { detail: { name, returnEvent, group } };
      cache.set('key::grp', data);

      cacheDriverPlugin.handleRequest(req);

      expect(dispatchEvent).to.be.calledWith(returnEvent, { name, data, group });
    });

    it('should expand an undefined group to the empty string', () => {
      const req = { detail: { name, returnEvent } };
      cache.set('key::', data);

      cacheDriverPlugin.handleRequest(req);

      expect(dispatchEvent).to.be.calledWith(returnEvent, { name, data, group: undefined });
    });

    it('should dispatch an undefined payload if no data is cached', () => {
      const req = { detail: { name, returnEvent, group } };

      cacheDriverPlugin.handleRequest(req);

      expect(dispatchEvent).to.be.calledWith(returnEvent, { name, data: undefined, group });
    });
  });
});
