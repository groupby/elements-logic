import { Plugin, PluginDirectory, PluginRegistry } from '../plugin';

/**
 * Calculates the missing dependencies of the given plugins. The given
 * plugins and the plugins in the registry are eligible to satisfy
 * dependencies.
 *
 * @param plugins The plugins whose dependencies should be checked.
 * @param registry The plugin registry containing all registered plugins.
 * @returns An array of names of missing plugins.
 */
export function calculateMissingDependencies(plugins: Plugin[], registry: PluginRegistry): string[] {
  const available = [
    ...Object.keys(registry),
    ...plugins.map(({ metadata: { name } }) => name),
  ];
  const required = plugins.reduce((memo, plugin) => [...memo, ...plugin.metadata.depends], []);
  const availableSet = new Set(available);
  const requiredSet = new Set(required);
  const difference = new Set(Array.from(requiredSet).filter((p) => !availableSet.has(p)));

  return Array.from(difference.values()).sort();
}

/**
 * Calls the `register` function of each plugin. The values returned by
 * each plugin are added to the given registry.
 *
 * @param plugins The plugins to register.
 * @param registry The registry into which to add the plugins' exposed values.
 * @param directory The directory into which to add the plugins.
 * @returns An object containing the keys and values of the new items
 * added to the registry.
 */
export function registerPlugins(
  plugins: Plugin[], 
  registry: PluginRegistry, 
  directory: PluginDirectory
): PluginRegistry {
  const newlyRegistered = Object.create(null);
  const newPlugins = Object.create(null);

  plugins.forEach((plugin) => {
    const exposedValue = plugin.register(Object.create(registry));
    const { name } = plugin.metadata;

    newlyRegistered[name] = exposedValue;
    newPlugins[name] = plugin;
  });

  Object.assign(registry, newlyRegistered);
  Object.assign(directory, newPlugins);
  return newlyRegistered;
}

/**
 * Calls the optional `init` function of each plugin.
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
 * Calls the optional `ready` function of each plugin.
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

/**
 * Unregisters the plugins with the given names from the given registry
 * and directory. It is safe to attempt to unregister a plugin that is
 * not registered.
 *
 * @param names The names of the plugins to unregister.
 * @param registry The registry from which to unregister the plugin's
 * exposed value.
 * @param directory The directory from which to unregister the plugin.
 */
export function unregisterPlugins(names: string[], registry: PluginRegistry, directory: PluginDirectory) {
  names.forEach((name) => {
    const plugin = directory[name];
    if (plugin && typeof plugin.unregister === 'function') {
      plugin.unregister();
    }
  });
  names.forEach((name) => {
    delete registry[name];
    delete directory[name];
  });
}
