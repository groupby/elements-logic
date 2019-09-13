import { Plugin } from '../plugin';

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
  /** The names of each plugin's dependers. */
  [name: string]: string[];
}

/**
 * Creates an empty dependency graph.
 *
 * @returns An empty dependency graph.
 * @hidden
 */
function createEmptyGraph(): DependencyGraph {
  return Object.create(null);
}

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
  }, createEmptyGraph());
}

/**
 * Deeply merges the given dependency graphs without modifying the
 * original graphs. When a property exists in more than one graph, the
 * corresponding arrays are concatenated.
 *
 * @param graphs The dependency graphs to merge.
 * @returns The merged dependency graph.
 */
export function mergeDependencyGraphs(...graphs: DependencyGraph[]): DependencyGraph {
  return graphs.reduce((merged, graph) => {
    Object.keys(graph).forEach((key) => {
      if (!merged[key]) merged[key] = [];
      merged[key].push(...graph[key]);
    });
    return merged;
  }, createEmptyGraph());
}

/**
 * Removes the specified names from the given dependency graph. The
 * corresponding properties are deleted and the dependency lists are
 * updated. The original graph is not modified.
 *
 * @param graph The graph to remove plugins from.
 * @param names The names of the plugins to remove from the graph.
 * @returns The resulting graph with the given names removed.
 * @throws If one or more names cannot be removed from the graph without
 *         breaking a dependency.
 */
export function removeFromDependencyGraph(graph: DependencyGraph, names: string[]): DependencyGraph {
  const namesSet = new Set(names);

  const newGraph = Object.keys(graph).reduce((clone, plugin) => {
    clone[plugin] = graph[plugin].filter((depender) => !namesSet.has(depender));
    return clone;
  }, createEmptyGraph());

  const errors = names
    .filter((name) => newGraph[name].length > 0)
    .map((name) => `${name} is required by: ${newGraph[name].join(', ')}.`);

  if (errors.length > 0) throw new Error(`Failed to remove dependencies.\n${errors.join('\n')}`);

  names.forEach((name) => { delete newGraph[name] });

  return newGraph;
}
