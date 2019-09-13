import { expect, sinon, stub } from '../../utils';
import Core from '../../../src/core';
import * as CoreUtils from '../../../src/utils/core';
import * as DependencyUtils from '../../../src/utils/dependencies';

describe('Core', () => {
  let core: Core;

  beforeEach(() => {
    core = new Core();
  });

  describe('constructor()', () => {
    it('should create an empty null-prototype plugins registry object', () => {
      expect(core.registry).to.be.empty;
      expect(Object.getPrototypeOf(core.registry)).to.be.null;
    });

    it('should create an empty null-prototype plugins directory object', () => {
      expect(core.directory).to.be.empty;
      expect(Object.getPrototypeOf(core.directory)).to.be.null;
    });

    it('should create an empty null-prototype plugin dependency graph object', () => {
      expect(core.dependencyGraph).to.be.empty;
      expect(Object.getPrototypeOf(core.dependencyGraph)).to.be.null;
    });
  });

  describe('register()', () => {
    let calculateMissingDependencies;
    let registerPlugins;
    let initPlugins;
    let readyPlugins;

    beforeEach(() => {
      calculateMissingDependencies = stub(CoreUtils, 'calculateMissingDependencies');
      registerPlugins = stub(CoreUtils, 'registerPlugins');
      initPlugins = stub(CoreUtils, 'initPlugins');
      readyPlugins = stub(CoreUtils, 'readyPlugins');
    });

    it('should throw if dependencies are not met', () => {
      const plugins: any = [
        {
          metadata: {
            name: 'a',
            depends: ['x'],
          },
        },
        {
          metadata: {
            name: 'b',
            depends: ['a'],
          },
        },
      ];
      calculateMissingDependencies.returns(['x']);
      Object.assign(core.registry, { m: 'mm' });

      expect(() => core.register(plugins)).to.throw();
      expect(calculateMissingDependencies).to.be.calledWith(plugins, sinon.match(core.registry));
    });

    it('should call the lifecycle events in order on the plugins', () => {
      const plugins: any = [
        {
          metadata: {
            name: 'a',
            depends: [],
          },
        },
        {
          metadata: {
            name: 'b',
            depends: [],
          },
        },
      ];
      calculateMissingDependencies.returns([]);

      core.register(plugins);

      expect(registerPlugins).to.be.calledWith(
        plugins,
        sinon.match(core.registry),
        sinon.match(core.directory)
      );
      expect(initPlugins).to.be.calledWith(plugins);
      expect(readyPlugins).to.be.calledWith(plugins);
      sinon.assert.callOrder(
        registerPlugins,
        initPlugins,
        readyPlugins
      );
    });

    it('should update the dependency graph', () => {
      const plugins: any = [
        {
          metadata: {
            name: 'b',
            depends: [],
          },
        },
      ];
      const dependencies = core.dependencyGraph = { a: [] };
      const newDependencies = { b: [] };
      const mergedDependencies = { a: [], b: [] };
      const createDependencyGraph = stub(DependencyUtils, 'createDependencyGraph').returns(newDependencies);
      const mergeDependencyGraphs = stub(DependencyUtils, 'mergeDependencyGraphs').returns(mergedDependencies);
      calculateMissingDependencies.returns([]);

      core.register(plugins);

      expect(createDependencyGraph).to.be.calledWith(plugins);
      expect(mergeDependencyGraphs).to.be.calledWith(dependencies, newDependencies);
      expect(core.dependencyGraph).to.deep.equal(mergedDependencies);
    });
  });

  describe('unregister()', () => {
    let removeFromDependencyGraph;
    let unregisterPlugins;
    let registry;
    let directory;
    let dependencyGraph;

    beforeEach(() => {
      removeFromDependencyGraph = stub(DependencyUtils, 'removeFromDependencyGraph');
      unregisterPlugins = stub(CoreUtils, 'unregisterPlugins');
      registry = core.registry = {
        a: { a: 'a' },
        b: () => /b/,
        c: 'c',
      };
      directory = core.directory = {
        a: { metadata: { name: 'a', depends: [] } },
        b: { metadata: { name: 'b', depends: ['a'] } },
        c: { metadata: { name: 'c', depends: ['a'] } },
      } as any;
      dependencyGraph = core.dependencyGraph = {
        a: ['b', 'c'],
        b: [],
        c: [],
      };
    });

    it('should call unregisterPlugins with the given plugins', () => {
      const names = ['a', 'c'];

      core.unregister(names);

      expect(unregisterPlugins).to.be.calledWith(
        names,
        sinon.match.same(registry),
        sinon.match.same(directory)
      );
    });

    it('should update the dependency graph', () => {
      const names = ['b', 'c'];
      const updatedGraph = {
        a: [],
      };
      removeFromDependencyGraph.returns(updatedGraph);

      core.unregister(names);

      expect(core.dependencyGraph).to.deep.equal(updatedGraph);
    });

    it('should throw and not unregister plugins if a dependency would be broken', () => {
      const names = ['a'];
      removeFromDependencyGraph.throws();

      const callback = () => core.unregister(names);

      expect(callback).to.throw();
      expect(unregisterPlugins).to.not.be.called;
    });
  });

  describe('unregisterAll()', () => {
    it('should call unregisterPlugins with all plugins', () => {
      const names = ['a', 'b', 'c'];
      const registry = core.registry = {
        a: { a: 'a' },
        b: () => /b/,
        c: 'c',
      };
      const directory = core.directory = {
        a: { metadata: { name: 'a', depends: [] } },
        b: { metadata: { name: 'b', depends: ['a'] } },
        c: { metadata: { name: 'c', depends: ['a'] } },
      } as any;
      const unregisterPlugins = stub(CoreUtils, 'unregisterPlugins');

      core.unregisterAll();

      expect(unregisterPlugins).to.be.calledWith(
        names,
        sinon.match.same(registry),
        sinon.match.same(directory)
      );
    });

    it('should clear dependency graph', () => {
      const unregisterPlugins = stub(CoreUtils, 'unregisterPlugins');
      core.dependencyGraph = { a: ['a'] };

      core.unregisterAll();

      expect(core.dependencyGraph).to.be.empty;
    });
  });
});
