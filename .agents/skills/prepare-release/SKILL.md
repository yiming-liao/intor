---
name: prepare-release
description: Prepare an Intor package release with Changesets by reviewing the release plan, applying agreed version updates, and verifying dependencies, changelogs, and packed artifacts. Use for release preparation or readiness checks, not npm publishing or writing release notes alone.
---

# Prepare an Intor release

Prepare a reviewable release and hand it to the maintainer for manual
publication. Do not run `pnpm release`, any publish command, tag creation,
Git push, or GitHub Release creation/editing as part of this skill. A request
to prepare a release does not itself authorize a commit; create one only when
requested or already authorized in the conversation.

## Read the maintained workflow

Read the [release guide](../../../docs/releasing.md), root `package.json`,
`.changeset/config.json`, and affected package manifests. These files define
the current scripts, version policy, Node matrix, and dependency contracts;
do not hard-code their present versions into this skill. Use existing scripts
instead of duplicating build, lint, or test commands.

Resolve the repository root from the directory containing this `.agents`
folder. Inspect working-tree and staged changes before editing. Preserve
unrelated work and do not reset, stash, or commit it to obtain a clean tree.
If the guide's clean-tree prerequisite is not met, finish read-only planning
and identify the specific changes that need a commit before versioning.

## Identify the release state

Inspect pending changesets, version/changelog diffs, recent release commits,
local tags, and read-only npm version metadata. Compare the exact planned
versions with the registry; `latest` alone does not establish publication.
Do not infer unpublished status from a network/authentication failure. For
recently published versions, allow one fresh-cache or `--prefer-online`
recheck, then report unresolved availability.

Distinguish these states before taking action:

- **Pending changesets:** calculate the plan with `pnpm changeset status`.
  Save JSON output outside the tracked tree when useful for later comparison.
- **Already versioned, not published:** recover the intended batch from the
  release commit or version/changelog diffs. Do not rerun versioning just
  because the current invocation asks to prepare a release.
- **Partially or fully published:** report exact per-package status. Do not
  bump again, move tags, or retry publication. Hand recovery or post-release
  actions to the maintainer.
- **No pending release:** report that no new release is identified. Do not
  invent a changeset for documentation/tooling-only changes or derive a new
  version solely from the newest tag.

Do not combine pending changesets for future work with an already prepared
batch without establishing which release the user wants.

## Review and apply the plan

Summarize each affected package's current version, next version, and reason
for inclusion, including dependent-package bumps. Keep unchanged packages
separate. Check the full public workspace for unpublished versions, since
Changesets publish can select more than the most recent changeset.

Use the user's requested version and previously agreed policy. Ask only when
the calculated plan introduces an unresolved decision, such as an unexpected
major bump, an unverified peer range, or a version-policy exception. Existing
agreement in the conversation is sufficient; do not request it again.

Do not relax peer ranges just to suppress a bump. Validate newly claimed
compatibility against the relevant versions using isolated consumers and
packed packages, following the release guide. Distinguish public APIs from
internal APIs and document any supported-mode limitations.

Once the plan is established and the guide's prerequisites are met, use
`pnpm release:version`. Review consumed changesets, versions, changelogs,
dependency ranges, and lockfile changes against the saved plan. If versioning
succeeds but lockfile installation fails, repair that stage and resume there;
do not replay the entire version command or recreate consumed changesets.

## Validate and hand off

Run the guide's installation, dedupe, and `pnpm release:check` steps for the
final state. Verify the configured Node matrix locally or through existing CI
results for the same revision. Report untested versions rather than claiming
complete matrix coverage. Repeat checks only when subsequent changes affect
their validity.

Pack every package in the release plan into a temporary directory. Inspect
versions, export targets, included files, and published dependency ranges;
`workspace:` ranges must resolve in the packed manifests. For changed runtime
or dependency contracts, use isolated consumer checks. Keep test artifacts
and registry caches out of the repository. Do not change scripts or skip
failing checks merely to mark a release ready.

Return a concise handoff containing:

- Readiness: ready, already prepared/published, or blocked by specific items.
- Exact package/version list, existing release commit and tags when present.
- Checks actually performed, their results, and any known or unverified limits.
- Remaining commit work or other prerequisites, followed by the next manual
  command. Recommend `pnpm release` only when publication is the next step;
  explicitly say not to rerun `release:version` for an already prepared batch.

Use the separate [release-notes skill](../release-notes/SKILL.md) if the user
also requests a draft. Keep preparation, notes, and manual publication as
separate responsibilities.
