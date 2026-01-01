# Intor Server

Server-side execution layer of Intor.

Provides request-scoped primitives for locale resolution,
message loading, and translator creation.

---

## Structure

#### • **intor/**

High-level server bootstrap entry.  
 Composes runtime primitives into a complete initialization flow.

#### • **runtime/**

Request-scoped execution lifecycle.  
 Owns the _ensureMessages → translator_ contract.

#### • **messages/**

Server-side message loading pipeline.  
 Handles local / remote loaders, fallbacks, and caching.

#### • **translator/**

Translator instance creation utilities.  
 Produces snapshot-based translation APIs.

#### • **helpers/**

Optional convenience wrappers.  
 Shortcuts for common server integration patterns.
