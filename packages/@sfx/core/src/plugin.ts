export interface Plugin {
  metadata: PluginMetadata;
  register(plugins: object): any;
  init?: () => void;
}

export interface PluginMetadata {
  name: string;
}
