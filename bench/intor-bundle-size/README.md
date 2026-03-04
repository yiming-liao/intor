## Bundle Size

Measured with a minimal Vite + React app (production build, gzip).

| Entry                         | Gzip Size |
| ----------------------------- | --------- |
| Baseline (no Intor)           | ~0.07 KB  |
| Core ("intor")                | +0.54 KB  |
| React adapter ("intor/react") | +1.21 KB  |

Fully tree-shakable. Import only what you use.  
Only the imported entry is included in the final bundle.
