# Intor — Architecture Overview

Intor is an i18n system built around **clear responsibility boundaries**.

Each module answers exactly one question and nothing more.

---

## Core Modules

#### • Config — _Intent_

Defines user intent as structured, validated configuration.

#### • Routing — _Decision_

Transforms collected context into a single, deterministic routing result.

#### • Server — _Resolution & Bootstrap_

Resolves runtime context and produces bootstrap data
for adapters and runtimes.

#### • Client — _Reaction_

Reacts to resolved decisions and applies them in the execution environment.

---

## One-Way Data Flow

1. When running in a pure client environment (CSR only):

```
Config → Client Runtime
```

2. When running in a server-only environment:

```
Config → Routing → Server Runtime
```

3. When both server and client runtimes are involved (SSR / hybrid environments):

```
Config → Routing → Server Runtime → Client Runtime
```

Routing is applied only when request context exists.  
Runtime layers react to resolved decisions.

---

## Design Principles

- Intent, decision, and runtime are separated
- Policies are explicit and deterministic
- Runtime layers react, never decide
