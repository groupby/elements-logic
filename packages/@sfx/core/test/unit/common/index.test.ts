import { AssertTypesEqual, expect } from '../../utils';
import {
  Core as CoreExport,
  Plugin as PluginExport,
  PluginMetadata as PluginMetadataExport,
  PluginRegistry as PluginRegistryExport,
} from '../../../src';
import Core from '../../../src/core';
import { Plugin, PluginMetadata, PluginRegistry } from '../../../src/plugin';

describe('Entry point', () => {
  it('should export Core', () => {
    expect(CoreExport).to.equal(Core);
  });

  it('should export the Plugin interface', () => {
    const test: AssertTypesEqual<Plugin, PluginExport> = true;
  });

  it('should export the PluginMetadata interface', () => {
    const test: AssertTypesEqual<PluginMetadata, PluginMetadataExport> = true;
  });

  it('should export the PluginRegistry interface', () => {
    const test: AssertTypesEqual<PluginRegistry, PluginRegistryExport> = true;
  });
});
