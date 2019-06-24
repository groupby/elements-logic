export interface Plugin {
  metadata: PluginMetadata;
  register(plugins: object): any;
}

export interface PluginMetadata {
  name: string;
}
