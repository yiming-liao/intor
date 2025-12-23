# Intor Routing

This module defines the routing decision layer of Intor.

It converts collected locale and pathname context into a single,
deterministic routing result used by the runtime and adapters.

## What this module does

- Determines the active locale based on configured routing policies
- Resolves pathname transformations (e.g. locale prefix strategies)
- Provides a single source of truth for routing decisions

## What this module does NOT do

- Does not read from request or response objects
- Does not perform redirects or side effects
- Does not depend on any framework APIs
- Does not manage domain or user state

## Module Overview

- **`locale/`**  
  Locale resolution logic based on configured routing policies and
  collected locale context.

- **`pathname/`**  
  Pathname resolution and transformation logic, including locale
  prefix strategies.

- **`resolve-routing.ts`**  
  The orchestration entry that combines locale and pathname resolution
  into a unified routing result.

## Design Philosophy

> Adapters collect facts.  
> Routing decides truth.

Adapters are responsible for collecting routing context from the environment.  
This module is responsible for applying routing policies to that context in a deterministic way.
