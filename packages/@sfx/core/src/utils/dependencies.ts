import { Plugin } from '../plugin';

/**
 * Builds a dependency graph from the given plugins.
 *
 * @param plugins The plugins from which to build the graph.
 * @returns The completed dependency graph.
 */
export function createDependencyGraph(plugins: Plugin[] = []): DependencyGraph {
  return plugins.reduce((dependencyGraph, { metadata: { name, depends } }) => {
    if (!dependencyGraph[name]) dependencyGraph[name] = [];

    depends.forEach((dependency) => {
      if (!dependencyGraph[dependency]) dependencyGraph[dependency] = [];
      dependencyGraph[dependency].push(name);
    });

    return dependencyGraph;
  }, Object.create(null));
}

export function mergeDependencyGraphs(...graphs: DependencyGraph[]): DependencyGraph {
  return graphs.reduce((merged, graph) => {
    Object.keys(graph).forEach((key) => {
      if (!merged[key]) merged[key] = [];
      merged[key].push(...graph[key]);
    });
    return merged;
  }, Object.create(null));
}

/**
 * The type of the plugin dependency graph. The dependency graph is a
 * directed graph whose vertices are plugins and whose edges are
 * "depended-on" relations. For example, an edge going from plugin A to
 * plugin B means that A is depended on by B (that is, B depends on A).
 *
 * The graph is represented as an adjacency list, which itself is
 * represented as an object whose keys are plugin names and whose values
 * are lists of the names of dependent plugins.
 */
export interface DependencyGraph {
  /** The names of each plugin's dependents. */
  [name: string]: string[];
}
