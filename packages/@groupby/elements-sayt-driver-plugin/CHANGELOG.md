# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] [minor]
### Added
- ELE-247: Exported `SaytDriverOptions` interface.

## [0.1.0] - 2019-11-28
### Added
- SFX-160: Added the `SaytDriverPlugin` module.
  - The `SaytDriverPlugin` module acts as a mediator between the Logic and View layers for prebuilt modules.
  - SFX-248: The `@groupby/elements-events` package is used for event names and payload interfaces.
  - SFX-333: Added retrieval and event emission of products.
  - SFX-385: Added the option to supply a custom product transformer.
  - SFX-158: Autocomplete responses are saved to the cache if available.
