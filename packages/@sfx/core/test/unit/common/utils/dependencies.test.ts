import { expect, spy } from '../../../utils';
import {
  createDependencyGraph,
  mergeDependencyGraphs,
  removeFromDependencyGraph,
} from '../../../../src/utils/dependencies';

describe('DependencyUtils', () => {
  describe('createDependencyGraph()', () => {
    it('should return an object without inherited properties', () => {
      const dependencies = createDependencyGraph();

      expect(Object.getPrototypeOf(dependencies)).to.be.null;
    });

    it('should return an empty object given an empty array', () => {
      const plugins = [];

      const dependencies = createDependencyGraph(plugins);

      expect(dependencies).to.deep.equal({});
    });

    it('should include names of the plugins passed in as terminal nodes', () => {
      const plugins: any = [
        { metadata: { name: 'a', depends: [] } },
        { metadata: { name: 'b', depends: [] } },
        { metadata: { name: 'c', depends: [] } },
      ];

      const dependencies = createDependencyGraph(plugins);

      expect(dependencies).to.deep.equal({
        a: [],
        b: [],
        c: [],
      });
    });

    it('should include the names of the dependencies as non-terminal nodes', () => {
      const plugins: any = [
        { metadata: { name: 'a', depends: ['a_dep'] } },
        { metadata: { name: 'b', depends: ['b_dep', 'a_dep'] } },
        { metadata: { name: 'c', depends: [] } },
      ];

      const dependencies = createDependencyGraph(plugins);

      expect(dependencies).to.deep.equal({
        a: [],
        b: [],
        c: [],
        a_dep: ['a', 'b'],
        b_dep: ['b'],
      });
    });

    it('should support circular dependencies', () => {
      const plugins: any = [
        { metadata: { name: 'a', depends: ['b'] } },
        { metadata: { name: 'b', depends: ['a'] } },
        { metadata: { name: 'c', depends: ['c'] } },
      ];

      const dependencies = createDependencyGraph(plugins);

      expect(dependencies).to.deep.equal({
        a: ['b'],
        b: ['a'],
        c: ['c'],
      });
    });
  });

  describe('mergeDependencyGraphs()', () => {
    it('should return an object without inherited properties', () => {
      const merged = mergeDependencyGraphs();

      expect(Object.getPrototypeOf(merged)).to.be.null;
    });

    it('should "merge" one graph', () => {
      const first = {
        a: ['b'],
        b: [],
        c: ['c'],
      };

      const merged = mergeDependencyGraphs(first);

      expect(merged).to.deep.equal({
        a: ['b'],
        b: [],
        c: ['c'],
      });
    });

    it('should merge disjunct graphs', () => {
      const first = {
        a: ['b'],
        b: [],
        c: ['c'],
      };
      const second = {
        d: ['e', 'f'],
        e: [],
        f: [],
      };
      const third = {};

      const merged = mergeDependencyGraphs(first, second, third);

      expect(merged).to.deep.equal({
        a: ['b'],
        b: [],
        c: ['c'],
        d: ['e', 'f'],
        e: [],
        f: [],
      });
    });

    it('should merge the values of non-disjunct graphs', () => {
      const first = {
        a: ['b'],
        b: [],
        c: ['c'],
      };
      const second = {
        a: ['d'],
        d: ['e', 'f'],
        e: [],
      };
      const third = {};
      const fourth = {
        a: ['f'],
        b: [],
        d: [],
        f: [],
      };

      const merged = mergeDependencyGraphs(first, second, third, fourth);

      expect(merged).to.deep.equal({
        a: ['b', 'd', 'f'],
        b: [],
        c: ['c'],
        d: ['e', 'f'],
        e: [],
        f: [],
      });
    });
  });

  describe('removeFromDependencyGraph()', () => {
    it('should remove nothing given no plugin names', () => {
      const graph = {
        a: [],
        b: ['a', 'c'],
        c: [],
      };

      const newGraph = removeFromDependencyGraph(graph, []);

      expect(newGraph).to.deep.equal({
        a: [],
        b: ['a', 'c'],
        c: [],
      });
    });

    it('should throw when attempting to remove a plugin that will break a dependency', () => {
      const graph = {
        a: ['b'],
        b: [],
        c: [],
      };

      const callback = () => removeFromDependencyGraph(graph, ['a']);

      expect(callback).to.throw();
    });

    it('should return a new graph with the specified dependencies removed', () => {
      const graph = {
        a: [],
        b: ['a', 'c'],
        c: [],
        d: [],
      };

      const newGraph = removeFromDependencyGraph(graph, ['a', 'd']);

      expect(newGraph).to.deep.equal({
        b: ['c'],
        c: [],
      });
    });

    it('should not modify the original graph', () => {
      const dependersOfPluginA = [];
      const graph = {
        a: dependersOfPluginA,
        b: ['a', 'c'],
        c: [],
      };

      const newGraph = removeFromDependencyGraph(graph, ['a']);

      expect(newGraph).not.to.equal(graph);
      expect(graph.a).to.equal(dependersOfPluginA);
    });

    it('should remove plugin chains', () => {
      const graph = {
        a: ['b'],
        b: [],
        c: [],
        d: ['c'],
      };

      const newGraph = removeFromDependencyGraph(graph, ['a', 'b']);

      expect(newGraph).to.deep.equal({
        c: [],
        d: ['c'],
      });
    });

    it('should remove circularly dependent plugins', () => {
      const graph = {
        a: ['b'],
        b: ['a'],
        c: [],
        d: ['d'],
      };

      const newGraph = removeFromDependencyGraph(graph, ['a', 'b', 'd']);

      expect(newGraph).to.deep.equal({
        c: [],
      });
    });
  });
});
