# Message Processing

This module provides a semantic message processing flow for **_translated rich-formatted strings_**.

It parses messages containing semantic tags (e.g. `<b>`, `<link>`) into a
structured representation that can be rendered in any environment.

> **Parse once, render anywhere.**

## Flow

```
tokenize ➔ ast ➔ render
```

Each stage has a single responsibility and is independently testable.

---

## Stages

#### ⬩Tokenize

```ts
tokenize(message: string): Token[]
```

Converts a message string into a flat stream of semantic tokens.  
Invalid or unsupported syntax is treated as plain text (fail-closed).

#### ⬩Build AST

```ts
buildAST(tokens: Token[]): ASTNode[]
```

Builds a nested semantic AST from tokens and validates tag structure.

#### ⬩Render

```ts
render(nodes: ASTNode[], renderer: Renderer): Output[]
```

Traverses the AST and delegates rendering to a provided renderer.  
Rendering behavior is fully controlled by the renderer.

## Orchestrators

High-level convenience APIs:

```ts
parseRichMessage(message): ASTNode[]
renderRichMessage(message, renderer): Output[]
```

Use these to parse or render rich messages end-to-end.

---

## Renderers

A renderer defines how semantic nodes are converted into output
(string, DOM, React, etc.).

The core flow is environment-agnostic and renderer-driven.

## Design Notes

- Semantic tags, not HTML
- Fail-closed syntax
- Pure, composable stages
- No runtime or framework coupling
