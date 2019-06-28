export interface Plugin {
  metadata: PluginMetadata;
  register: (plugins: PluginRegistry) => any;
  init?: () => void;
  ready?: () => void;
}

export interface PluginMetadata {
  name: string;
  depends: string[];
}

export interface PluginRegistry {
  [key: string]: any;
}
