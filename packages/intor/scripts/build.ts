import { run } from "./run";

run("rollup -c rollup/core.js");

// client
run("rollup -c rollup/react.js");
run("rollup -c rollup/vue.js");
run("rollup -c rollup/svelte.js");

// adapters
run("rollup -c rollup/next.js");
run("rollup -c rollup/svelte-kit.js");
run("rollup -c rollup/express.js");
run("rollup -c rollup/fastify.js");
run("rollup -c rollup/hono.js");
