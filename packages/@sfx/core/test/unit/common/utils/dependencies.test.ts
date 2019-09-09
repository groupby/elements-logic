import { expect, spy } from '../../../utils';
import {
  createDependencyGraph,
} from '../../../../src/utils/dependencies';

describe('DependencyUtils', () => {
  describe('createDependencyGraph()', () => {
    it('should return an object without inherited properties', () => {
      const dependencies = createDependencyGraph([]);

      expect(Object.getPrototypeOf(dependencies)).to.be.null;
    });

    it('should return an empty object given an empty array', () => {
      const plugins = [];

      const dependencies = createDependencyGraph(plugins);

      expect(dependencies).to.deep.equal({});
    });

    it('should create an empty object when given plugins with no dependencies', () => {
      const plugins: any = [
        { metadata: { name: 'a', depends: [] } },
        { metadata: { name: 'b', depends: [] } },
        { metadata: { name: 'c', depends: [] } },
      ];

      const dependencies = createDependencyGraph(plugins);

      expect(dependencies).to.deep.equal({});
    });
  });
});
