<h1 align="center">@intor/reader-json5</h1>

<div align="center">

JSON5 reader for **intor**.

</div>

<div align="center">

[![NPM version](https://img.shields.io/npm/v/@intor%2freader-json5?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/@intor%2freader-json5)
[![TypeScript](https://img.shields.io/badge/TypeScript-%E2%9C%94-blue?style=flat&colorA=000000&colorB=000000)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/npm/l/@intor%2freader-json5?style=flat&colorA=000000&colorB=000000)](LICENSE)

</div>

## Installation

```bash
# npm
npm install @intor/reader-json5

# yarn
yarn add @intor/reader-json5

# pnpm
pnpm add @intor/reader-json5
```

## Example

**Setup**

```ts
import { json5Reader } from "@intor/reader-json5";

const { t } = await getTranslator(intorConfig, {
  locale,
  readers: { json5: json5Reader },
});
```

**Message file**

`messages/en/example.json5`

```json5
{
  // This is a comment
  text: "Coding is fun",
}
```

**Usage**

```ts
t("example.text");
// → "Coding is fun"
```
