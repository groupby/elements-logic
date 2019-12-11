# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] [patch]
### Changed
- ELE-247: Changed the type of the `SaytPlugin` options object to be `SaytPluginOptions` instead of `SaytConfig`.

### Added
- ELE-247: Added the `SaytPluginOptions` interface. It extends the `SaytConfig` interface.

## [0.1.0] - 2019-11-28
### Added
- SFX-156: Added the `SaytPlugin` module.
  - It exposes an instance of the [`Sayt` client library](https://www.npmjs.com/package/sayt) to `Core`.
  - This package also re-exports everything from the `sayt` package.
