import { Plugin } from '../plugin';

/**
 * The type of a plugin dependency graph. This dependency graph
 * represents the reverse dependency relationships of the plugins: a
 * plugin points to the plugins that list it as a dependency. For
 * example, plugin A will point to plugin B if B lists A as a
 * dependency.
 *
 * The graph is represented as an adjacency list, which itself is
 * represented as an object whose keys are plugin names and whose values
 * are lists of the names of the depending plugins.
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
  const dependencyGraph = createEmptyGraph();

  plugins.forEach(({ metadata: { name, depends } }) => {
    if (!dependencyGraph[name]) dependencyGraph[name] = [];

    depends.forEach((dependency) => {
      if (!dependencyGraph[dependency]) dependencyGraph[dependency] = [];
      dependencyGraph[dependency].push(name);
    });
  });

  return dependencyGraph;
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
 * updated. The original graph is not modified. It is safe to attempt to
 * remove a name that is not in the graph.
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
    .filter((name) => newGraph[name] && newGraph[name].length > 0)
    .map((name) => `${name} is required by: ${newGraph[name].join(', ')}.`);

  if (errors.length > 0) throw new Error(`Failed to remove dependencies.\n${errors.join('\n')}`);

  names.forEach((name) => { delete newGraph[name]; });

  return newGraph;
}
