export interface Plugin {
  metadata: PluginMetadata;
  register(plugins: object): any;
  init?: () => void;
  ready?: () => void;
}

export interface PluginMetadata {
  name: string;
  depends: string[];
}
