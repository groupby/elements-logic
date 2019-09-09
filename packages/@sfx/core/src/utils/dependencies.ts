import { Plugin } from '../plugin';

export function createDependencyGraph(plugins: Plugin[]): DependencyGraph {
  return Object.create(null);
}

/**
 * The type of the plugin dependency graph. The graph is a mapping from a
 * plugin name to all the names of the plugins that depend on it.
 */
export interface DependencyGraph {
  [name: string]: string[];
}
