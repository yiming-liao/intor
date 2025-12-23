# Intor Config

This module defines the configuration layer of Intor.

It transforms user-provided options into a resolved, validated
configuration that can be safely consumed by the runtime and routing layers.

## What this module does

- Defines the structure of Intor configuration
- Applies default values and normalizes user options
- Validates configuration consistency and invariants
- Produces a resolved configuration used as a single source of truth

## What this module does NOT do

- Does not read from request or runtime environments
- Does not perform routing or locale resolution
- Does not execute side effects or framework-specific logic

## Module Overview

- **`types/`**  
  Type definitions that describe the shape of user-provided and resolved
  configuration objects.

- **`constants/`**  
  Shared constant values used across configuration resolution and validation.

- **`resolvers/`**  
  Pure functions responsible for applying defaults, normalizing options,
  and resolving derived configuration values.

- **`validators/`**  
  Validation utilities that enforce configuration invariants and ensure
  consistency before runtime consumption.

- **`define-intor-config.ts`**  
  The main entry point for defining and resolving Intor configuration.

## Design Philosophy

> Configuration expresses intent.  
> Resolution establishes truth.

User configuration is treated as declarative intent.  
This module resolves and validates that intent into a deterministic,
trusted configuration for the rest of the system.
