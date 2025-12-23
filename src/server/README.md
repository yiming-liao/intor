# Intor Server

This module defines the server-side runtime of Intor.

It orchestrates initialization in a server environment by resolving
the initial locale and preparing translation runtime state.

## What this module does

- Provides the main server-side entry point (`intor`)
- Resolves the initial locale using a provided locale resolver
- Loads locale messages from configured sources (local or remote)
- Prepares runtime state required for server-side translation

## What this module does NOT do

- Does not define routing or locale decision policies
- Does not read request or response objects directly
- Does not perform redirects or framework-specific side effects
- Does not manage client-side runtime or UI concerns

## Module Overview

- **`intor/`**  
  The primary server-side entry point that orchestrates locale resolution
  and message loading.

- **`messages/`**  
  Server-side message loading logic, including local and remote loaders
  and shared message utilities.

- **`translator/`**  
  Utilities for creating and accessing translation runtime instances.

- **`shared/`**  
  Internal shared utilities used across server modules (e.g. logging,
  message pools).

- **`helpers/`**  
  Optional convenience helpers for integrating Intor into custom server
  environments (e.g. URL-based message exposure).

## Design Philosophy

> **Server runtime orchestrates.**  
> **Policies decide elsewhere.**

The server layer focuses on coordinating initialization flow and preparing runtime data.  
All routing decisions and configuration policies are delegated to their respective core modules.
