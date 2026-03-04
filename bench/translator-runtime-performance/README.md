## Runtime Performance

Measured on Node.js 22 (1,000,000 iterations per test).

| Scenario                     | Per Call |
| ---------------------------- | -------- |
| Deep resolution (fixed key)  | ~0.15 µs |
| Random resolution            | ~0.14 µs |
| Replacement                  | ~0.32 µs |
| Large dictionary (100k keys) | ~0.33 µs |

Resolution scales with depth, not dictionary size.  
Even with 100k messages per locale, lookup remains under 0.35 µs per call.
