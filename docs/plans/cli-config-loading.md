# CLI config loading plan

Status: Needs clarification (support contract not finalized)

Created / updated: 2026-09-27

Scope: Config loading and error diagnostics in `intor-cli`

Integration guide: [Intor quickstart](../quickstart.md)

This document tracks decisions, tasks, and acceptance criteria for a single improvement. No CLI changes or tests have been added for this work. The proposed contract and test expectations below are not existing support guarantees.

## Problem and goal

A consumer application encountered a module exports error while loading its config and currently uses a `NODE_OPTIONS` workaround. The exact options, Node version, and failing package entry point still need to be recorded.

The goal is for the Intor CLI to handle config loading without requiring each consumer to adjust startup flags. The work has two parts: preserving loading errors, and defining and implementing a loading contract.

## Evidence and reproduction limits

### Confirmed from source during the documentation review

- The CLI entry point runs through `tsx`; the config loader defaults to `import(filePath)`.
- The `catch` in `resolveConfigModule` discards the original exception and only logs `failed to import module`, so even `--debug` omits the root cause.
- Existing resolver unit tests do not cover a real consumer's cross-module import chain.

### Prior investigation (not rerun during this review)

- The original notes describe a temporary consumer using Node 22.22.1 and tsx 4.21.0 to reproduce this chain:
  `config.ts → helper.ts → ESM package with only an import export condition`.
- The chain threw `ERR_PACKAGE_PATH_NOT_EXPORTED` without `type: module` and succeeded after adding `type: module`.

Reproduction limits: the experiment used `node --import <tsx loader>` with an ESM runner. It has not been verified through the full CLI entry point or checked against the original consumer. The temporary fixture was removed; persistent integration tests are needed.

## Execution order

Complete the original-case investigation and support contract in phase 1, then build the integration reproduction in phase 2. Loader selection and implementation in phase 4 depend on both. Diagnostic improvements in phase 3 can proceed independently. Mark this work complete only after phase 5 passes.

## 1. Confirm the support contract and original case

Proposed contract (pending confirmation):

> The CLI can load `.ts` configs written with `import/export` without requiring the consumer to set `type: module`, including indirect imports through local `.ts` helpers of packages that expose only an `import` export condition.

- [ ] Record the original consumer's complete `NODE_OPTIONS`, Node and intor-cli versions, and failing package entry point.
- [ ] Obtain a minimal config/helper import chain and determine whether it matches the existing reproduction.
- [ ] Confirm whether configs and helpers must support mixing in `require`, `module.exports`, or `__dirname`; this affects the choice of module semantics.
- [ ] Confirm whether the CLI's declared Node `>=20.0.0` range remains the support commitment, and define the versions to validate.
- [ ] Confirm and document the final loading contract before selecting a loader implementation.

Factory discovery is outside this change; consumers continue to call `defineIntorConfig` directly. Do not add support for framework-specific aliases, browser environments, or bundler plugins, and preserve existing capabilities. Changing the entire consumer's module mode or adding `require` entries to individual packages is not the intended fix.

## 2. Add an integration reproduction and regression tests

- [ ] Create an isolated consumer fixture and run it through the actual CLI entry point so the test framework does not handle module loading on the CLI's behalf.
- [ ] Remove this issue's `NODE_OPTIONS` workaround from the baseline test and record the current failure.
- [ ] Cover the cases below and add tests for the confirmed CommonJS contract.

The successful outcomes below assume the proposed contract is accepted. Update this matrix when the contract is finalized.

| Case                                                                         | Expected result after the fix                                               |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| No `type: module`; TS config directly imports an import-only package         | Config resolves successfully                                                |
| No `type: module`; local TS helper indirectly imports an import-only package | The full import chain succeeds                                              |
| `type: module` is set; same import chain                                     | Continues to succeed                                                        |
| Previously supported configs and path resolution                             | No regressions                                                              |
| Import of a missing or unexported package entry point                        | Debug output includes the original loading error                            |
| Config throws during execution                                               | Execution error is preserved, without misclassifying it as an exports issue |

Tests must include a package with **only an `import` export condition**. Testing a package whose contents are ESM is insufficient to cover this issue.

## 3. Preserve original loading errors

This phase can be completed independently before the loader decision.

- [ ] Preserve the failing config path and existing warning.
- [ ] Make `--debug` show the original error name, message, code, stack, and cause when present.
- [ ] Handle thrown values that are not `Error` instances without causing another diagnostic failure.
- [ ] Preserve the current behavior of continuing the scan after a single config fails to load.
- [ ] Verify debug mode on and off, including error details rather than only the generic warning.

## 4. Validate and implement the loader

- [ ] Evaluate candidates against the fixtures and select a solution only after it satisfies the contract.
- [ ] Verify that the full import chain selects the packages' `import` exports correctly.
- [ ] Verify that existing path resolution and functions in configs retain their behavior.
- [ ] Check for changes to module identity, caching, execution counts, and side effects.
- [ ] Avoid adopting a retry with a different loader on failure without evaluating side effects; a config may already have performed side effects before throwing.
- [ ] Implement the smallest necessary change while preserving factory discovery rules.
- [ ] Run relevant tests, type checks, and integration validation across the confirmed Node support range.

## 5. Validate the original consumer and update documentation

- [ ] With this issue's `NODE_OPTIONS` workaround removed from the original consumer, verify discovery and the command that originally failed.
- [ ] Confirm that the correct config is discovered and downstream command output is correct; the absence of an exception is insufficient.
- [ ] Permanently remove the consumer workaround after acceptance checks pass.
- [ ] Document the config loading contract, limitations, and debug diagnostics in the CLI documentation.

## Completion criteria

- [ ] The final support contract and limitations are documented.
- [ ] Integration tests through the real CLI pass, and debug output preserves the root cause.
- [ ] The original consumer no longer needs the workaround, and downstream output is correct.
- [ ] Existing supported behavior has no regressions, and the committed Node version range has been validated.
- [ ] CLI usage documentation is up to date.

Attach verifiable test results, commits, or issue links when checking off items. Keep this work incomplete until acceptance has been verified in the original consumer.

## Decision log

No loader solution has been selected. Once the contract is finalized, record the decision date, supported module semantics and Node range, chosen solution and trade-offs, and validation evidence here. Until then, keep these decisions open.

## Related files

- [CLI entry point](../../packages/intor-cli/src/cli/index.ts)
- [Config discovery](../../packages/intor-cli/src/core/discover-configs/discover-configs.ts)
- [Config module resolver](../../packages/intor-cli/src/core/discover-configs/resolve-config-module.ts)
- [Resolver tests](../../packages/intor-cli/__test__/unit/core/discover-configs/resolve-config-module.test.ts)
- [Logger](../../packages/intor-cli/src/shared/log/logger.ts)
- [CLI package.json](../../packages/intor-cli/package.json)
- [CLI README](../../packages/intor-cli/README.md)
