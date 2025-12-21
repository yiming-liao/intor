import { run } from "./run";

// clean up
run("rm -rf dist");

// rollup -> js
run("rollup -c .config/rollup/core.js");
run("rollup -c .config/rollup/react.js");
run("rollup -c .config/rollup/next.js");

// dts
run("tsc -p tsconfig.build.json");
run("tsc-alias tsconfig.build.json --outDir dist");
