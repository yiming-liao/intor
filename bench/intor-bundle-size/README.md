## Bundle Size

Measured with a minimal Vite + React app (production build, gzip).

| Entry                         | Gzip Size |
| ----------------------------- | --------- |
| Baseline (no Intor)           | ~0.04 KB  |
| Core ("intor")                | +0.56 KB  |
| React adapter ("intor/react") | +3.83 KB  |

Fully tree-shakable. Import only what you use.  
Only the imported entry is included in the final bundle.
