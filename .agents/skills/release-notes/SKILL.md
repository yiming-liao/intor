---
name: release-notes
description: Draft or revise English GitHub Release notes for this Intor repository from its release template, package changelogs, and verified release history. Use when asked to write release notes for an Intor tag or coordinated package release; does not publish releases.
---

# Intor release notes

Produce a consumer-facing Markdown draft for a specific release. Publishing
is performed manually by the maintainer. This workflow does not bump versions,
consume changesets, commit, tag, push, publish npm packages, or create/edit a
GitHub Release (including a remote draft).

## Source of truth

Read these repository documents before drafting; do not duplicate or replace
the template in this skill:

- [Release notes template](../../../docs/release-notes-template.md): structure,
  authoring rules, and review checklist.
- [Release guide](../../../docs/releasing.md): current versioning policy and
  publication workflow.

Resolve repository paths from the directory containing this `.agents` folder,
not from the user's current subdirectory. Prefer source and package manifests
at the target tag over a working tree that may contain subsequent changes.

## Establish the release scope

Use the user's target package/tag and comparison baseline when provided.
Otherwise inspect the available release commits, tags, and changelogs. Infer
the target only when the evidence identifies a single release batch; ask a
focused question if multiple targets or baselines remain plausible.

Find the previous relevant GitHub Release, not merely the previous Git tag or
npm version. With `gh`, use read-only `release list` and `release view` calls
for `yiming-liao/intor`, and inspect the selected comparison range with Git.
The previous release must precede the target and cover the relevant package;
exclude the target itself if its GitHub Release already exists. Preserve
historical tag spellings such as `intor-v2.9.0`.

Read all relevant changelog entries and implementation changes across that
range. Include intermediate npm versions that had no GitHub Release. When
changelogs do not cover older changes, inspect the corresponding commits.
GitHub's latest release and semver sorting alone do not establish the baseline
for a historical or prerelease target.

For a coordinated batch, derive package versions from the release commit and
matching package tags. Check npm availability with read-only registry queries
before presenting those versions as published. Use a fresh temporary cache or
`--prefer-online` for one recheck if recent publication returns stale metadata;
otherwise report the uncertainty rather than polling indefinitely. Do not
include unchanged packages as newly released.

If GitHub or npm is unavailable, continue drafting from local evidence where
possible and disclose what could not be verified. Missing evidence must not
be replaced with invented release dates, compatibility claims, or migrations.

## Draft and deliver

Follow the template's section order, omit empty sections, and replace every
placeholder. Emphasize changed defaults and migration actions even when a
maintainer intentionally selected a minor version. Treat recorded versioning
exceptions as release-specific, not as permission to apply them to later work.

Check examples against the target version's exported APIs and configuration
behavior. Use four-backtick code fences. Summarize consumer impact rather than
tooling setup or test logs. If existing release notes were supplied, preserve
accurate content while reconciling it with the same evidence.

Return the proposed release title and copy-ready English Markdown body in the
conversation. Put comparison tags, evidence links, and unresolved verification
items outside the release body. Save a file only when the user requests one,
using their specified path or a clearly named local draft. Do not edit the
shared template, changelogs, or version manifests as part of drafting notes.
