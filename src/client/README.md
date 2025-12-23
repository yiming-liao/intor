# Intor Client

This module defines the client-side runtime of Intor.

It is responsible for maintaining locale state, managing message
lifecycles, and exposing the translation runtime in browser environments.

## What this module does

- Manages client-side locale state and updates
- Coordinates message loading and revalidation on locale changes
- Provides React context providers for translation runtime
- Exposes client-only helpers for non-framework (CSR) environments
- Applies browser-side side effects (cookies, `<html lang>`, etc.)

## What this module does NOT do

- Does not resolve routing or pathname policies
- Does not make locale decisions based on request context
- Does not perform server-side rendering or data fetching
- Does not contain framework adapters

## Module Overview

- **`react/`**  
  React integrations, including context providers and hooks
  that expose the client-side translation runtime.

- **`helpers/`**  
  Public, client-only helper APIs for pure CSR environments.

- **`shared/utils/`**  
  Low-level browser utilities used internally by client runtime
  and helpers.

## Design Philosophy

> Client runtime coordinates state.  
> Decisions live elsewhere.

The client layer focuses on **reacting** to resolved configuration and routing decisions, not making them.
Locale policies, routing logic, and message resolution strategies are delegated to their respective core modules.
