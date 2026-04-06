<h1 align="center">@intor/reader-md</h1>

<div align="center">

Markdown reader for **intor**.

</div>

<div align="center">

[![NPM version](https://img.shields.io/npm/v/@intor%2freader-md?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/@intor%2freader-md)
[![TypeScript](https://img.shields.io/badge/TypeScript-%E2%9C%94-blue?style=flat&colorA=000000&colorB=000000)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/npm/l/@intor%2freader-md?style=flat&colorA=000000&colorB=000000)](LICENSE)

</div>

## Installation

```bash
# npm
npm install @intor/reader-md

# yarn
yarn add @intor/reader-md

# pnpm
pnpm add @intor/reader-md
```

## Example

**Setup**

```ts
import { mdReader } from "@intor/reader-md";

const { t } = await getTranslator(intorConfig, {
  locale,
  readers: { md: mdReader },
});
```

**Message file**

`messages/en/example.md`

```md
### Coding is fun
```

**Usage**

```ts
// Markdown content is exposed under the `content` key by default
t("example.content");
// → "### Coding is fun"
```
