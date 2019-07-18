# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- SFX-155: Added the `SearchDataSourcePlugin` module.
  - It exposes an instance of the [BrowserBridge from the `Search` api client library](https://www.npmjs.com/package/groupby-api) to `Core`.
  - This package also re-exports everything from the `groupby-api` package.
