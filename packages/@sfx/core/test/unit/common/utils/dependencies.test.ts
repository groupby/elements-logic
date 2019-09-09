import { expect, spy } from '../../../utils';
import {
  createDependencyGraph,
  mergeDependencyGraphs,
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
      const dependencies = mergeDependencyGraphs();

      expect(Object.getPrototypeOf(dependencies)).to.be.null;
    });
  });
});
