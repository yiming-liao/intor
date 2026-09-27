# Releasing packages

This repository uses Changesets 2.x to support the Node 20 and 22 CI matrix.
Releases are performed manually. Each public package has its own version;
private workspace packages are not versioned or published.

## Prepare with Codex

Invoke `$prepare-release` to inspect release readiness, or specify an intended
version, for example `$prepare-release prepare intor@2.11.0`. The
[project skill](../.agents/skills/prepare-release/SKILL.md) reads this guide,
reviews the complete package plan, applies agreed version changes when needed,
and verifies the resulting artifacts.

It distinguishes pending changesets from already prepared or published
versions, so repeated invocation does not imply another version bump. It
reports unresolved versioning or compatibility decisions before applying
those changes. Existing agreement in the conversation remains valid.

The skill does not publish, push, create tags, or create a GitHub Release.
Commits require a user request or existing authorization. Use `$release-notes`
for the release text and perform publication manually with `pnpm release`
after preparation is complete.

## Version and dependency policy

Public packages use independent versions (`fixed` and `linked` are empty).
Keep existing exact workspace dependencies for Intor and the CLI; dependent
packages may receive patch releases when those dependencies change. The CLI
uses explicit `workspace:^<version>` ranges for readers, so release preparation
resolves local packages and publication preserves caret ranges.

Readers declare `workspace:2.9.1 || 2.10.0` as their Intor peer range. Packing
removes the workspace prefix and preserves the explicit supported versions.
Do not widen this to all of 2.x without validating the reader contract:
the Markdown reader uses runtime constants from `intor/internal`, which is
not a stable public API. Review the peer range before each Intor release.

Changesets is pinned to 2.31.1 because this workflow uses the experimental
`onlyUpdatePeerDependentsWhenOutOfRange` option. An Intor update within the
reader's supported peer range does not automatically require a reader major
release. Widening that range is recorded explicitly as a reader patch change.
Review the calculated release plan whenever upgrading Changesets.

Before adding a supported Intor version, install the packed readers in an
isolated consumer with that version using strict peer checks. Verify JSON5,
TOML, YAML, and Markdown parsing, including Markdown metadata, and verify
that all four exports satisfy `MessagesReader` in TypeScript.

For 2.9.1 and the 2.10.0 candidate, runtime checks and TypeScript 5.9.3 with
`moduleResolution: "Bundler"` pass. Strict `NodeNext` checking fails in both
versions because Intor's generated declaration imports omit extensions.
This is an existing declaration-packaging limitation, not a regression or
a claim of NodeNext support in this release.

## Record a change

Run from the repository root:

````sh
pnpm changeset
````

Select affected packages and write an English, consumer-facing summary.
Use patch for compatible fixes, minor for compatible features, and major for
breaking changes in stable packages. Document any explicitly agreed exception.
Documentation-only and tooling-only changes do not need a changeset.

The cookie default change is intentionally released as `intor@2.10.0`, a
one-time versioning-policy exception. The release notes must explain that
cookies now require `cookie.enabled: true` to preserve the previous behavior.
This exception does not make future breaking changes minor by default.

## Prepare versions

Start from a clean working tree with the implementation and its changesets
committed. Review the calculated release plan before consuming changesets:

````sh
pnpm changeset status
pnpm release:version
````

`release:version` updates package versions and changelogs, consumes pending
changesets, and refreshes the lockfile. Review all affected packages. A
`workspace:*` dependency becomes an exact version when packed, so updating
Intor can also require releases of its CLI and readers. Peer updates outside
the declared supported range can force a reader major release. Review peer
ranges before accepting that plan.
Independent versioning does not mean dependency updates are skipped.

Run the release checks and review package contents:

````sh
pnpm install --frozen-lockfile --strict-peer-dependencies
pnpm dedupe --check
pnpm release:check
pnpm --dir packages/intor pack --pack-destination /tmp/intor-release-review
````

Inspect the artifacts for every package in the release plan. Confirm that
public export targets exist and packed dependencies contain no `workspace:`
ranges. Ensure the Node 20 and 22 CI checks pass for the release revision.
Commit the reviewed versions, changelogs, and lockfile before publishing.

## Publish

Use an npm account authorized to publish the affected public packages. Verify
the account and registry without printing authentication tokens:

````sh
npm whoami --registry=https://registry.npmjs.org/
pnpm release
````

`release:check` runs the existing full CI script, including builds, type
checks, lint, API checks, tests, and type tests.

`release` runs `release:check` and only publishes if it succeeds. Changesets checks
registry versions and publishes public workspace versions that are not yet
published, then creates local package tags. Review all workspace versions,
not just the most recent changeset. The default npm dist-tag is `latest`.
An interactive OTP may be required by the account's authentication settings.

Publish from the release commit. Do not add unrelated commits between
versioning and publishing. After verifying the published versions and tags,
push the release commit and the new release tags to the remote.

New tags use Changesets' `package-name@version` convention; older tags such as
`intor-v2.9.0` remain unchanged. If publication partially fails, inspect npm
versions before retrying; already published versions cannot be overwritten.

## Write GitHub Release notes

Use the project skill with `$release-notes intor@2.10.0` (substitute the target
tag) to draft notes in Codex. It reads the template and release evidence and
returns an English draft; publication remains manual. The skill lives in
[.agents/skills/release-notes](../.agents/skills/release-notes/SKILL.md).

Use the [release notes template](release-notes-template.md) for each GitHub
Release. Write English notes from the package changelogs and verified tag
comparison, including intermediate npm releases since the previous GitHub
Release. The template is applied manually; Changesets continues to manage
per-package changelogs.

Use the primary package's existing tag as the Release title and tag. For a
coordinated batch, summarize related package versions in the same notes.
Explain behavior changes and migration steps even when a minor version is
an explicitly agreed exception. Remove empty sections and placeholders.

After npm availability and remote tags are verified, the maintainer reviews
and publishes the GitHub Release manually. Creating notes does not publish
packages or create tags, and `pnpm release` does not create a GitHub Release.

## References

- [Changesets CLI](https://github.com/changesets/changesets/blob/main/docs/command-line-options.md)
- [Changesets configuration](https://github.com/changesets/changesets/blob/main/docs/config-file-options.md)
