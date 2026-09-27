# Changesets

Add a changeset for each user-facing package change with `pnpm changeset`.
Choose the affected packages, the SemVer bump, and an English summary of
what changes for consumers. Commit the changeset with the implementation.
Documentation-only and tooling-only changes do not require a package release.

Packages are versioned independently. Internal dependency updates can still
require dependent packages to be released. Private workspace packages are
not versioned or published.

See [the release guide](../docs/releasing.md) for the manual release workflow.
