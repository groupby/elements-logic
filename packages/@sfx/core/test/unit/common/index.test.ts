import { expect } from 'chai';
import CoreExport, { Plugin as PluginExport, PluginMetadata as PluginMetadataExport } from '../../../src';
import Core from '../../../src/core';
import { Plugin, PluginMetadata } from '../../../src/plugin';
import * as CoreUtils from '../../../src/utils/core';

describe('Entry point', () => {
  it('should export Core as default', () => {
    expect(CoreExport).to.equal(Core);
  });

  it('should export the Plugin interface', () => {
    // The following should cause a compiler error if the two interfaces are not equal.
    const plugin_is_assignable_to_plugin_export: PluginExport = {} as Plugin;
    const plugin_export_is_assignable_to_plugin: Plugin = {} as PluginExport;
  });

  it('should export the PluginMetadata interface', () => {
    // The following should cause a compiler error if the two interfaces are not equal.
    const plugin_metadata_is_assignable_to_plugin_metadata_export: PluginMetadataExport = {} as PluginMetadata;
    const plugin_metadata_export_is_assignable_to_plugin_metadata: PluginMetadata = {} as PluginMetadataExport;
  });
});
