import { expect, spy } from '../../../utils';
import {
  calculateMissingDependencies,
  initPlugins,
  readyPlugins,
  registerPlugins,
  unregisterPlugins,
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
      ];

      const missing = calculateMissingDependencies(plugins, registry);

      expect(missing).to.have.members(['x', 'z']);
    });

    it('should return no missing dependencies when all are met', () => {
      const registry = {
        a: 'aa',
        b: 'bb',
        c: 'cc',
      };
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
      ];

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
      let localRegistryA;
      let localRegistryB;
      const plugins: any = [
        {
          metadata: { name: 'a' },
          register: (r) => { localRegistryA = r; },
        },
        {
          metadata: { name: 'b' },
          register: (r) => { localRegistryB = r; },
        },
      ];
      const registry: any = {};

      registerPlugins(plugins, registry, {});

      expect(localRegistryA).to.be.an('object');
      expect(localRegistryB).to.be.an('object');

      const cvalue = registry.c = 'cc';

      expect(localRegistryA.c).to.equal(cvalue);
      expect(localRegistryB.c).to.equal(cvalue);
    });

    it('should return a map of new plugin keys to exposed values', () => {
      const valueA = { a: 'a' };
      const valueB = () => /b/;
      const valueC = 'c';
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

      const newlyRegistered = registerPlugins(plugins, {}, {});

      expect(newlyRegistered).to.deep.equal({
        pluginA: valueA,
        pluginB: valueB,
        pluginC: valueC,
      });
      expect(newlyRegistered.pluginA).to.equal(valueA);
      expect(newlyRegistered.pluginB).to.equal(valueB);
      expect(newlyRegistered.pluginC).to.equal(valueC);
    });

    it('should add the newly registered plugins to the plugin registry', () => {
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

      registerPlugins(plugins, registry, {});

      expect(registry).to.deep.equal({
        a: 'b',
        pluginA: valueA,
        pluginB: valueB,
      });
      expect(registry.pluginA).to.equal(valueA);
      expect(registry.pluginB).to.equal(valueB);
    });

    it('should not allow plugins to modify the registry', () => {
      const plugins: any = [
        {
          metadata: { name: 'x' },
          // eslint-disable-next-line
          register: (plugins) => {
            delete plugins.a;
            plugins.b = 'bb';
          },
        },
      ];
      const registry = { a: 'aa' };

      registerPlugins(plugins, registry, {});

      expect(registry.a).to.equal('aa');
      expect(registry).to.not.have.any.keys('b');
    });

    it('should add the newly registered plugins to the plugin directory', () => {
      const pluginA = {
        metadata: { name: 'pluginA' },
        register: () => 'a',
      };
      const pluginB = {
        metadata: { name: 'pluginB' },
        register: () => 'b',
      };
      const pluginC = {
        metadata: { name: 'pluginC' },
        register: () => 'c',
      };
      const plugins: any = [pluginA, pluginB];
      const registry: any = { pluginC: 'c' };
      const directory: any = { pluginC };

      registerPlugins(plugins, registry, directory);

      expect(directory).to.deep.equal({ pluginA, pluginB, pluginC });
      expect(directory.pluginA).to.equal(pluginA);
      expect(directory.pluginB).to.equal(pluginB);
      expect(directory.pluginC).to.equal(pluginC);
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

  describe('unregisterPlugins()', () => {
    it('should call the unregister function of the unregistered plugins', () => {
      const unregisterA = spy();
      const unregisterB = spy();
      const unregisterC = spy();
      const names = ['a', 'c'];
      const registry: any = {
        a: { a: 'a' },
        b: () => /b/,
        c: 'c',
      };
      const directory: any = {
        a: {
          metadata: { name: 'a' },
          unregister: unregisterA,
        },
        b: {
          metadata: { name: 'b' },
          unregister: unregisterB,
        },
        c: {
          metadata: { name: 'c' },
          unregister: unregisterC,
        },
      };

      unregisterPlugins(names, registry, directory);

      expect(unregisterA).to.be.called;
      expect(unregisterC).to.be.called;
      expect(unregisterB).to.not.be.called;
    });

    it('should remove the corresponding entry from the registry', () => {
      const names = ['a', 'c'];
      const bValue = () => /b/;
      const directory: any = {
        a: {
          metadata: { name: 'a' },
          unregister: () => null,
        },
        b: {
          metadata: { name: 'b' },
          unregister: () => null,
        },
        c: {
          metadata: { name: 'c' },
          unregister: () => null,
        },
      };
      const registry: any = {
        a: { a: 'a' },
        b: bValue,
        c: 'c',
      };

      unregisterPlugins(names, registry, directory);

      expect(registry).to.deep.equal({ b: bValue });
    });

    it('should not remove the entry from the registry until all the unregistration hooks have been called', () => {
      const valueA = spy();
      const valueB = spy();
      const names = ['a', 'b'];
      const registry = {
        a: valueA,
        b: valueB,
      };
      const directory: any = {
        a: {
          metadata: { name: 'a' },
          unregister: () => registry.b(),
        },
        b: {
          metadata: { name: 'b' },
          unregister: () => registry.a(),
        },
      };

      unregisterPlugins(names, registry, directory);

      expect(valueA).to.be.called;
      expect(valueB).to.be.called;
    });

    it('should remove the corresponding entry from the directory', () => {
      const names = ['a', 'c'];
      const pluginB = {
        metadata: { name: 'b' },
        unregister: () => null,
      };
      const directory: any = {
        a: {
          metadata: { name: 'a' },
          unregister: () => null,
        },
        b: pluginB,
        c: {
          metadata: { name: 'c' },
          unregister: () => null,
        },
      };
      const registry: any = {
        a: { a: 'a' },
        b: () => /b/,
        c: 'c',
      };

      unregisterPlugins(names, registry, directory);

      expect(directory).to.deep.equal({ b: pluginB });
      expect(directory.b).to.equal(pluginB);
    });

    it('should not throw when a plugin does not have an unregister function', () => {
      const names = ['a', 'b', 'c'];
      const registry: any = {
        a: { a: 'a' },
        b: () => /b/,
        c: 'c',
      };
      const directory: any = {
        a: {
          metadata: { name: 'a' },
          unregister: () => null,
        },
        b: {
          metadata: { name: 'b' },
        },
        c: {
          metadata: { name: 'c' },
          unregister: () => null,
        },
      };

      expect(() => unregisterPlugins(names, registry, directory)).to.not.throw();
    });

    it('should ignore plugins not in the directory', () => {
      const names = ['a', 'c', 'z'];
      const bValue = () => /b/;
      const directory: any = {
        a: {
          metadata: { name: 'a' },
          unregister: () => null,
        },
        b: {
          metadata: { name: 'b' },
          unregister: () => null,
        },
        c: {
          metadata: { name: 'c' },
          unregister: () => null,
        },
      };
      const registry: any = {
        a: { a: 'a' },
        b: bValue,
        c: 'c',
      };

      unregisterPlugins(names, registry, directory);

      expect(registry).to.deep.equal({ b: bValue });
    });
  });
});
