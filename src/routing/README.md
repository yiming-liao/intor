# Routing Module

Pure routing logic for Intor.

Resolves locale, pathname, and navigation decisions in a deterministic,
framework-agnostic way.

---

## Structure

#### • **inbound/**

Resolves inbound routing state from adapter-collected inputs.  
 Produces a deterministic routing result used by server and edge adapters.

#### • **navigation/**

Resolves client-side navigation intent into an executable navigation result.  
 Typically used by client adapters to decide how navigation should occur.

#### • **locale/**

Pure utilities for extracting locale information from individual sources.

#### • **pathname/**

Pure utilities for normalizing and transforming localized pathnames.
