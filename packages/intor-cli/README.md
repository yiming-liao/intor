<h1 align="center">intor-cli</h1>

<div align="center">

[![NPM version](https://img.shields.io/npm/v/intor-cli?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/intor-cli)
[![TypeScript](https://img.shields.io/badge/TypeScript-%E2%9C%94-blue?style=flat&colorA=000000&colorB=000000)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/npm/l/intor-cli?style=flat&colorA=000000&colorB=000000)](LICENSE)

</div>

## Overview

- **discover** — config discovery
- **generate** — schema and type generation
- **check** — static usage analysis
- **validate** — locale completeness validation

<img src='demo.gif' />

## Commands

Running `intor-cli` without a command launches the interactive menu.

### Discover

```bash
npx intor-cli discover
```

Discovers Intor configs in the current workspace.

### Generate

```bash
npx intor-cli generate
```

Generates schemas and TypeScript types from the default locale.

### Check

```bash
npx intor-cli check
```

Analyzes translator usage and reports diagnostics.

### Validate

```bash
npx intor-cli validate
```

Validates locale messages against generated schemas.

---

## Design Guarantees

- Schemas and types are inferred **only from the default locale**.
- All locales are expected to share the same message shape.
