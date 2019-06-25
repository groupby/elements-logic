import { Plugin } from '../plugin';

/**
 * TODO
 */
export function calculateMissingDependencies(plugins: Plugin[], registry: object): string[] {
  const availableSet = new Set(Object.keys(registry));
  const required = plugins.reduce((memo: [], plugin: Plugin) => {
    return [...memo, ...plugin.metadata.depends];
  }, [])
  const requiredSet = new Set(required);
  const difference = new Set(Array.from(requiredSet).filter((p) => !availableSet.has(p)));

  return Array.from(difference.values()).sort();
}

/**
 * TODO
 */
export function registerPlugins(plugins: Plugin[], registry: object) {
  const newlyRegistered = Object.create(null);

  plugins.forEach((plugin) => {
    const exposedValue = plugin.register(registry);
    const { name } = plugin.metadata;

    newlyRegistered[name] = exposedValue;
  });

  Object.assign(registry, newlyRegistered);

  return newlyRegistered;
}

/**
 * TODO
 */
export function initPlugins(plugins: Plugin[]) {
  plugins.forEach((plugin) => {
    if (typeof plugin.init === 'function') {
      plugin.init();
    }
  });
}

/**
 * TODO
 */
export function readyPlugins(plugins: Plugin[]) {
  plugins.forEach((plugin) => {
    if (typeof plugin.ready === 'function') {
      plugin.ready();
    }
  });
}
