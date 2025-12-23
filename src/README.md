# Intor — Architecture Overview

Intor is an i18n system built around **clear responsibility boundaries**.

Each module answers exactly one question and nothing more.

---

## Core Modules

#### Config — Intent

Defines user intent as structured, validated configuration.

#### Routing — Decision

Transforms collected context into a single, deterministic routing result.

#### Server — Orchestration

Coordinates initialization flow and prepares translation runtime data.

#### Client — Runtime

Manages client-side locale state, message updates, and browser effects.

---

## One-Way Data Flow

- When a server runtime is available (SSR / hybrid environments):

```
Config → Routing → Server Runtime → Client Runtime
```

- When running in a pure client environment (CSR only):

```
Config → Client Runtime
```

Routing is applied only when request context exists.  
Runtime layers react to resolved decisions.

---

## Design Principles

- Intent, decision, and runtime are separated
- Policies are explicit and deterministic
- Runtime layers react, never decide

---

## Philosophy

> Declare intent.  
> Decide truth.  
> React at runtime.
