<h1 align="center">@intor/reader-toml</h1>

<div align="center">

TOML reader for **intor**.

</div>

<div align="center">

[![NPM version](https://img.shields.io/npm/v/@intor%2freader-toml?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/@intor%2freader-toml)
[![TypeScript](https://img.shields.io/badge/TypeScript-%E2%9C%94-blue?style=flat&colorA=000000&colorB=000000)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/npm/l/@intor%2freader-toml?style=flat&colorA=000000&colorB=000000)](LICENSE)

</div>

## Installation

```bash
# npm
npm install @intor/reader-toml

# yarn
yarn add @intor/reader-toml

# pnpm
pnpm add @intor/reader-toml
```

## Example

**Setup**

```ts
import { tomlReader } from "@intor/reader-toml";

const { t } = await getTranslator(intorConfig, {
  locale,
  readers: { toml: tomlReader },
});
```

**Message file**

`messages/en/example.toml`

```toml
text = "Coding is fun"
```

**Usage**

```ts
t("example.text");
// → "Coding is fun"
```
