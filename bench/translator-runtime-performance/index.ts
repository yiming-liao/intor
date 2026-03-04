import { runLargeDictionary } from "./large-dictionary";
import { runReplacement } from "./replacement";
import { runResolution } from "./resolution";
import { runResolutionRandom } from "./resolution-random";

const results = [
  runResolution(),
  runResolutionRandom(),
  runReplacement(),
  runLargeDictionary(),
];

console.log("\nRuntime Benchmark Summary\n");

for (const r of results) {
  console.log(`${r.label.padEnd(35)} ${r.perCallUs.toFixed(4)} µs`);
}

console.log("\nDone.\n");
