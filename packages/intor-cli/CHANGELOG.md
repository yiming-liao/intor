# intor-cli

## 1.0.5

### Patch Changes

- **Node support change:** Require Node `^20.12.0 || >=22.0.0`, matching the loader and existing dependency API requirements. Upgrade older Node installations before using this CLI release. This support-range correction is intentionally included in the current patch release as a maintainer-approved version-policy exception.

- Start the CLI through a Node entry point that loads its own `tsx` dependency. Isolated installations no longer require a separate `tsx` executable on the consumer PATH.

- Updated dependencies [57dbf03]
- Updated dependencies [ec44378]
- Updated dependencies [2a95318]
- Updated dependencies [2233a7b]
- Updated dependencies [cae74f8]
- Updated dependencies [152ead7]
- Updated dependencies [e20f575]
- Updated dependencies [95b784c]
- Updated dependencies [f5c8da7]
- Updated dependencies [0e2fe9a]
- Updated dependencies [4d0b486]
- Updated dependencies [4869270]
- Updated dependencies [4b7a652]
  - intor@2.12.0
  - intor-translator@1.7.0
  - @intor/reader-json5@0.1.4
  - @intor/reader-md@0.1.8
  - @intor/reader-toml@0.1.4
  - @intor/reader-yaml@0.1.5

## 1.0.4

### Patch Changes

- Updated dependencies [eb7b068]
- Updated dependencies [9b47ed2]
  - intor@2.11.0
  - @intor/reader-json5@0.1.3
  - @intor/reader-md@0.1.7
  - @intor/reader-toml@0.1.3
  - @intor/reader-yaml@0.1.4

## 1.0.3

### Patch Changes

- Resolve readers from the local workspace during development and release preparation, preserving caret ranges in the published package.
- Updated dependencies [5f39e84]
  - intor@2.10.0
  - @intor/reader-json5@0.1.2
  - @intor/reader-md@0.1.6
  - @intor/reader-toml@0.1.2
  - @intor/reader-yaml@0.1.3
