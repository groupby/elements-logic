import { Plugin } from '../plugin';

/**
 * Calculates the missing dependencies of the given plugins. The given
 * plugins and the plugins in the registry are eligible to satisfy
 * dependencies.
 *
 * @param plugins The plugins whose dependencies should be checked.
 * @param registry The plugin registry containing all available plugins.
 * @returns an Array of names of missing plugins.
 */
export function calculateMissingDependencies(plugins: Plugin[], registry: object): string[] {
  const available = [
    ...Object.keys(registry),
    ...plugins.map(({ metadata: { name }}) => name),
  ];
  const availableSet = new Set(available);

  const required = plugins.reduce((memo, plugin) => {
    return [...memo, ...plugin.metadata.depends];
  }, []);
  const requiredSet = new Set(required);

  const difference = new Set(Array.from(requiredSet).filter((p) => !availableSet.has(p)));

  return Array.from(difference.values()).sort();
}

/**
 * Calls the `register` function of each plugin. The values returned by
 * each plugin are added to the given registry.
 *
 * @param plugins The plugins to register.
 * @param regsitry The registry to register the plugins into.
 * @returns an Object containing the keys and values of the new items
 * added to the registry.
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
 * Calls the `init` function of each plugin. If a plugin does not
 * exppose an `init` function, it is ignored.
 *
 * @param plugins The plugins to initialize.
 */
export function initPlugins(plugins: Plugin[]) {
  plugins.forEach((plugin) => {
    if (typeof plugin.init === 'function') {
      plugin.init();
    }
  });
}

/**
 * Calls the `ready` function of each plugin. If a plugin does not
 * expose a `ready` function, it is ignored.
 *
 * @param plugins The plugins to ready.
 */
export function readyPlugins(plugins: Plugin[]) {
  plugins.forEach((plugin) => {
    if (typeof plugin.ready === 'function') {
      plugin.ready();
    }
  });
}
