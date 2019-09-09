import { Plugin } from '../plugin';

export function createDependencyGraph(plugins: Plugin[]): DependencyGraph {
  return plugins.reduce((dependencyGraph, { metadata: { name, depends } }) => {
    if (!dependencyGraph[name]) dependencyGraph[name] = [];

    depends.forEach((dependency) => {
      if (!dependencyGraph[dependency]) dependencyGraph[dependency] = [];
      dependencyGraph[dependency].push(name);
    });

    return dependencyGraph;
  }, Object.create(null));
}

/**
 * The type of the plugin dependency graph. The graph is a mapping from a
 * plugin name to all the names of the plugins that depend on it.
 */
export interface DependencyGraph {
  [name: string]: string[];
}
