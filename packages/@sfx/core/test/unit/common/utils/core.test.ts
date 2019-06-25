import { expect } from 'chai';
import { match, spy } from 'sinon';
import {
  calculateMissingDependencies,
  initPlugins,
  readyPlugins,
  registerPlugins,
} from '../../../../src/utils/core';

describe('CoreUtils', () => {
  describe('calculateMissingDependencies()', () => {
    it('should return missing dependencies', () => {
      const registry = {
        a: 'aa',
        b: 'bb',
        c: 'cc',
      };
      const plugins: any = [
        {
          metadata: {
            name: 'm',
            depends: ['a', 'x'],
          },
        },
        {
          metadata: {
            name: 'n',
            depends: ['z'],
          },
        },
      ]

      const missing = calculateMissingDependencies(plugins, registry);

      expect(missing).to.have.members(['x', 'z']);
    });

    it('should return no missing dependencies when all are met', () => {
      const registry = {
        a: 'aa',
        b: 'bb',
        c: 'cc',
      }
      const plugins: any = [
        {
          metadata: {
            name: 'm',
            depends: ['a', 'b'],
          },
        },
        {
          metadata: {
            name: 'n',
            depends: ['b'],
          },
        },
      ]

      const missing = calculateMissingDependencies(plugins, registry);

      expect(missing).to.deep.equal([]);
    });

    it('should return no missing dependencies when there are no dependencies', () => {
      const registry = {
        a: 'aa',
        b: 'bb',
        c: 'cc',
      };
      const plugins: any = [
        {
          metadata: {
            name: 'm',
            depends: [],
          },
        },
        {
          metadata: {
            name: 'n',
            depends: [],
          },
        },
      ];

      const missing = calculateMissingDependencies(plugins, registry);

      expect(missing).to.deep.equal([]);
    });

    it('should return no missing dependencies when dependencies are satisfied by the new plugins', () => {
      const registry = {
        c: 'cc',
      };
      const plugins: any = [
        {
          metadata: {
            name: 'a',
            depends: ['b', 'c'],
          },
        },
        {
          metadata: {
            name: 'b',
            depends: ['c'],
          },
        },
      ];

      const missing = calculateMissingDependencies(plugins, registry);

      expect(missing).to.deep.equal([]);
    });

    it('should return no missing dependencies for satisfied circular dependencies', () => {
      const registry = {};
      const plugins: any = [
        {
          metadata: {
            name: 'a',
            depends: ['b'],
          },
        },
        {
          metadata: {
            name: 'b',
            depends: ['c'],
          },
        },
        {
          metadata: {
            name: 'c',
            depends: ['a'],
          },
        },
      ];

      const missing = calculateMissingDependencies(plugins, registry);

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

  describe('readyPlugins()', () => {
    it('should call the ready function of each plugin', () => {
      const readyA = spy();
      const readyB = spy();
      const plugins: any = [
        {
          metadata: { name: 'pluginA' },
          ready: readyA,
        },
        {
          metadata: { name: 'pluginB' },
          ready: readyB,
        },
      ];

      readyPlugins(plugins);

      expect(readyA).to.be.called;
      expect(readyB).to.be.called;
    });

    it('should not throw when a plugin does not have an ready function', () => {
      const plugins: any = [
        {
          metadata: { name: 'pluginA' },
        },
        {
          metadata: { name: 'pluginB' },
        },
      ];

      expect(() => readyPlugins(plugins)).to.not.throw();
    });
  });
});
