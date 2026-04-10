import { cancel as cancelCore } from "@clack/prompts";

export function cancel(): never {
  cancelCore("Operation cancelled.");
  process.exit(0);
}
