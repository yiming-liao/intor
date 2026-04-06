<h1 align="center">@intor/reader-yaml</h1>

<div align="center">

YAML reader for **intor**.

</div>

<div align="center">

[![NPM version](https://img.shields.io/npm/v/@intor%2freader-yaml?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/@intor%2freader-yaml)
[![TypeScript](https://img.shields.io/badge/TypeScript-%E2%9C%94-blue?style=flat&colorA=000000&colorB=000000)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/npm/l/@intor%2freader-yaml?style=flat&colorA=000000&colorB=000000)](LICENSE)

</div>

## Installation

```bash
# npm
npm install @intor/reader-yaml

# yarn
yarn add @intor/reader-yaml

# pnpm
pnpm add @intor/reader-yaml
```

## Example

**Setup**

```ts
import { yamlReader } from "@intor/reader-yaml";

const { t } = await getTranslator(intorConfig, {
  locale,
  readers: { yaml: yamlReader },
});
```

**Message file**

`messages/en/example.yaml`

```yaml
text: "Coding is fun"
```

**Usage**

```ts
t("example.text");
// → "Coding is fun"
```
