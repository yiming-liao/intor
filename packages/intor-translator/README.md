<h1 align="center">Intor Translator</h1>

<p align="center">
The <a href="https://github.com/yiming-liao/intor">Intor</a> translation engine
</p>

<div align="center">

[![NPM version](https://img.shields.io/npm/v/intor-translator?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/intor-translator)
[![TypeScript](https://img.shields.io/badge/TypeScript-%E2%9C%94-blue?style=flat&colorA=000000&colorB=000000)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/npm/l/intor-translator?style=flat&colorA=000000&colorB=000000)](LICENSE)

</div>

## Features

- **Modular Pipeline** – A pluggable, hook-driven flow for any translation logic.
- **Typed Autocomplete** – Inferred keys and locales with precise, reliable completion.
- **Framework-Agnostic** – A lightweight engine that runs anywhere in JavaScript.

## Installation

```bash
# npm
npm install intor-translator

# yarn
yarn add intor-translator

# pnpm
pnpm add intor-translator
```

## Quick Start

```typescript
import { Translator } from "intor-translator";

const messages = {
  en: {
    hello: "Hello World",
    greeting: "Hello, {name}!", // Use curly braces for replacements
  },
};

// Create a translator instance
const translator = new Translator({ messages, locale: "en" });

// Use the translator
translator.t("hello"); // -> Hello World
translator.t("greeting", { name: "John doe" }); // -> Hello, John doe!
```

---

## Handlers & Hooks

Intor Translator runs on an explicit, hook-driven pipeline.

**Ordered pipeline:**  
 resolveLocales → findMessage → **_loading_** → **_missing_** → **_format_** → interpolate

### Handlers

Handlers override specific pipeline stages:

- loading
- missing
- formatting

### Hooks

Hooks participate in the ordered pipeline and control how the translation process executes.

They allow external logic to extend or adjust the pipeline behavior.

---

**_For more advanced usage, see the full examples._**
[View examples ↗](https://github.com/yiming-liao/intor-translator/tree/main/examples)

**_See full benchmark details:_** [bench ↗](https://github.com/yiming-liao/intor-translator/tree/main/bench)
