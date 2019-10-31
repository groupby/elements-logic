# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- SFX-159: Added the `SearchDriverPlugin` module.
  - This plugin listens for a `SEARCH_REQUEST_EVENT` event, makes a
    search request using the GroupBy API, then dispatches a
    `SEARCH_RESPONSE_EVENT` event containing the response.
  - SFX-248: The `@elements/events` package is used for event names and payload interfaces.
  - SFX-385: Added the ability to supply plugin options through the constructor.
