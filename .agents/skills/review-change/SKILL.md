---
name: review-change
description: Review Intor changes for consumer compatibility, cross-package impact, and missing validation or release documentation. Use for change reviews before commit or release.
---

# Review Intor Changes

Review the requested diff; default to staged, unstaged, and relevant untracked changes when no range is given. State the scope. Review only unless fixes are also requested.

Focus on affected contracts:

- Consumer behavior: config defaults, locale resolution, cookies, and framework behavior can break consumers without changing API signatures.
- Public API: check exports, generated declarations, and type inference alongside runtime behavior.
- Package boundaries: trace affected translator, core, CLI, and reader dependencies, including reader usage of `intor/internal`. Check dependency and peer ranges against actual usage; do not assume all packages need a version bump.
- Release coverage: use the [release policy](../../../docs/releasing.md) to assess changesets and migration notes. Treat previous versioning exceptions as specific decisions, not general policy. Check [quickstart](../../../docs/quickstart.md) when setup or defaults change.

Read surrounding code and affected consumers before reporting a finding. Use existing package scripts for focused verification when useful; changes to exports, declarations, or package dependencies may need an isolated consumer using packed artifacts. Report which checks ran and what remains unverified; do not run publishing or versioning commands as part of review.

Return actionable findings ordered by severity, each with a file/line reference, triggering condition, and consumer impact. Separate uncertain risks and validation gaps from confirmed defects. If none are found, say so and note any material verification limits. Keep the response concise; omit stylistic preferences and generic checklists.
