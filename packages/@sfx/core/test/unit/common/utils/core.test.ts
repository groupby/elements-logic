import { expect } from 'chai';
import { match, spy } from 'sinon';
import {
  getMissingDependencies,
  initPlugins,
  registerPlugins,
} from '../../../../src/utils/core';

describe('CoreUtils', () => {
  describe('getMissingDependencies()', () => {
    it('should return missing dependencies', () => {
      const available = ['a', 'b', 'c'];
      const required = ['a', 'd', 'b', 'e'];

      const missing = getMissingDependencies(available, required);

      expect(missing).to.have.members(['d', 'e']);
    });

    it('should return no missing dependencies when all are met', () => {
      const available = ['a', 'b', 'c'];
      const required = ['a', 'b'];

      const missing = getMissingDependencies(available, required);

      expect(missing).to.deep.equal([]);
    });

    it('should return no missing dependencies when there are no dependencies', () => {
      const available = ['a', 'b', 'c'];
      const required = [];

      const missing = getMissingDependencies(available, required);

      expect(missing).to.deep.equal([]);
    });
  });

  describe('registerPlugins()', () => {
    it('should call the register function of each plugin with the plugin registry', () => {
      const registerA = spy();
      const registerB = spy();
      const plugins: any = [
        {
          metadata: { name: 'pluginA' },
          register: registerA,
        },
        {
          metadata: { name: 'pluginB' },
          register: registerB,
        },
      ];
      const registry = {};

      registerPlugins(plugins, registry);

      expect(registerA).to.be.calledWith(match.same(registry));
      expect(registerB).to.be.calledWith(match.same(registry));
    });

    it('should return a map of new plugin keys to exposed values', () => {
      const valueA = { a: 'a' };
      const valueB = { b: 'b' };
      const valueC = { c: 'c' };
      const plugins: any = [
        {
          metadata: { name: 'pluginA' },
          register: () => valueA,
        },
        {
          metadata: { name: 'pluginB' },
          register: () => valueB,
        },
        {
          metadata: { name: 'pluginC' },
          register: () => valueC,
        },
      ];
      const registry = {};

      const newlyRegistered = registerPlugins(plugins, registry);

      expect(newlyRegistered).to.deep.equal({
        pluginA: valueA,
        pluginB: valueB,
        pluginC: valueC,
      });
      expect(newlyRegistered.pluginA).to.equal(valueA);
      expect(newlyRegistered.pluginB).to.equal(valueB);
      expect(newlyRegistered.pluginC).to.equal(valueC);
    });

    it('should add the newly registered plugins to the initial registry', () => {
      const valueA = { a: 'a' };
      const valueB = { b: 'b' };
      const plugins: any = [
        {
          metadata: { name: 'pluginA' },
          register: () => valueA,
        },
        {
          metadata: { name: 'pluginB' },
          register: () => valueB,
        },
      ];
      const registry: any = { a: 'b' };

      registerPlugins(plugins, registry);

      expect(registry).to.deep.equal({
        a: 'b',
        pluginA: valueA,
        pluginB: valueB,
      });
      expect(registry.pluginA).to.equal(valueA);
      expect(registry.pluginB).to.equal(valueB);
    });
  });

  describe('initPlugins()', () => {
    it('should call the init function of each plugin', () => {
      const initA = spy();
      const initB = spy();
      const plugins: any = [
        {
          metadata: { name: 'pluginA' },
          init: initA,
        },
        {
          metadata: { name: 'pluginB' },
          init: initB,
        },
      ];

      initPlugins(plugins);

      expect(initA).to.be.called;
      expect(initB).to.be.called;
    });

    it('should not throw when a plugin does not have an init function', () => {
      const plugins: any = [
        {
          metadata: { name: 'pluginA' },
        },
        {
          metadata: { name: 'pluginB' },
        },
      ];

      expect(() => initPlugins(plugins)).to.not.throw();
    });
  });
});
