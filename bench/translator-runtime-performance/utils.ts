import { performance } from "node:perf_hooks";

export interface BenchResult {
  label: string;
  iterations: number;
  totalMs: number;
  perCallUs: number;
}

export function measure(
  label: string,
  iterations: number,
  fn: () => void,
): BenchResult {
  // warmup
  for (let i = 0; i < 10_000; i++) fn();

  const start = performance.now();

  for (let i = 0; i < iterations; i++) {
    fn();
  }

  const end = performance.now();

  const total = end - start;
  const perCall = (total / iterations) * 1000;

  return {
    label,
    iterations,
    totalMs: total,
    perCallUs: perCall,
  };
}
