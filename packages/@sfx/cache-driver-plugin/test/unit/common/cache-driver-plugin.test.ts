import { CACHE_REQUEST } from '@sfx/events';
import { expect, sinon, spy, stub } from '../../utils';
import CacheDriverPlugin from '../../../src/cache-driver-plugin';

describe('CacheDriverPlugin', () => {
  let cacheDriverPlugin;

  beforeEach(() => {
    cacheDriverPlugin = new CacheDriverPlugin();
  });

  describe('metadata getter', () => {
    it('should have the name `cache-driver`', () => {
      expect(cacheDriverPlugin.metadata.name).to.equal('cache-driver');
    });

    it('should specify `cache` and `dom_events` as dependencies', () => {
      expect(cacheDriverPlugin.metadata.depends).to.have.members(['cache', 'dom_events']);
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
    it('should dispatch the requested data from the cache', () => {
      const name = 'key';
      const group = 'grp';
      const returnEvent = 'ret';
      const data = { a: 'a' };
      const req = { name, returnEvent, group };
      const dispatchEvent = spy();
      cacheDriverPlugin.core = {
        cache: new Map([['key::grp', data]]),
        dom_events: { dispatchEvent },
      };

      cacheDriverPlugin.handleRequest(req);

      expect(dispatchEvent).to.be.calledWith(returnEvent, sinon.match.same(data));
    });
  });
});
