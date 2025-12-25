<h1 align="center">Intor</h1>

<div align="center">
  
A lightweight, framework-agnostic i18n engine that works instantly with a clean, type-safe API.  
Fast to start, easy to extend, and free from the usual i18n heaviness.

</div>

<div align="center">

[![NPM version](https://img.shields.io/npm/v/intor?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/intor)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/intor?style=flat&colorA=000000&colorB=000000)](https://bundlephobia.com/package/intor)
[![TypeScript](https://img.shields.io/badge/TypeScript-%E2%9C%94-blue?style=flat&colorA=000000&colorB=000000)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/npm/l/intor?style=flat&colorA=000000&colorB=000000)](LICENSE)

</div>

<div align="center">

#### 🍳 Cooking the Intor v2 docs, crafting them to perfection...

</div>

---

Intor separates language translation from semantic rendering.  
ICU operates at the text-translation layer, while semantic tags  
are parsed and rendered in a dedicated AST-based rendering phase.

```
┌──────────────────────────────────────────────┐
│                Application                   │
│                                              │
│  t() / tRich() / <T />                       │
└───────────────────────────┬──────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────┐
│        Translator (Language / Semantic)      │
│              intor-translator                │
│                                              │
│  Responsibilities:                           │
│  - Resolve message key                       │
│  - Locale resolution & fallback              │
│  - Message loading                           │
│  - Text-level interpolation                  │
│    • {name}, {count}                         │
│    • plural / select                         │
│    • ICU MessageFormat (optional)            │
│      (ignoreTag: true)                       │
│                                              │
│  Output:                                     │
│  - Translated string                         │
│  - May still contain <semantic tags>         │
└───────────────────────────┬──────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────┐
│      Semantic Parsing & AST Construction     │
│                                              │
│  Responsibilities:                           │
│  - Tokenize semantic tags                    │
│    • <b>, <link>, <Component>                │
│  - Build semantic AST                        │
│    • TextNode                                │
│    • TagNode                                 │
│                                              │
│  Note:                                       │
│  - Independent from ICU / formatter          │
│  - Pure semantic structure                   │
└───────────────────────────┬──────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────┐
│        Semantic Rendering (Renderer)         │
│                                              │
│  Responsibilities:                           │
│  - Traverse semantic AST                     │
│  - Render TextNode                           │
│  - Render TagNode                            │
│                                              │
│  Renderer decides output type:               │
│  - string                                    │
│  - ReactNode                                 │
│  - Vue / Svelte nodes                        │
│  - Markdown / CLI output                     │
│                                              │
│  Optional extensions:                        │
│  - Custom tag renderers                      │
│  - Rich components                           │
└───────────────────────────┬──────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────┐
│                 Final Output                 │
│                                              │
│  - Rendered rich content                     │
│  - Framework-specific result                 │
│                                              │
└──────────────────────────────────────────────┘
```
