import { run } from "./run";

// ----------------------------------------------------------
// clean up
// ----------------------------------------------------------
run("rm -rf dist");

// ----------------------------------------------------------
// rollup -> js
// ----------------------------------------------------------
run("rollup -c .config/rollup/core.js");

// client
run("rollup -c .config/rollup/react.js");
run("rollup -c .config/rollup/vue.js");
run("rollup -c .config/rollup/svelte.js");

// adapters
run("rollup -c .config/rollup/next.js");
run("rollup -c .config/rollup/svelte-kit.js");
run("rollup -c .config/rollup/express.js");
run("rollup -c .config/rollup/fastify.js");
run("rollup -c .config/rollup/hono.js");

// ----------------------------------------------------------
// dts
// ----------------------------------------------------------
run("tsc -p tsconfig.build.json");
run("tsc-alias tsconfig.build.json --outDir dist/types");
