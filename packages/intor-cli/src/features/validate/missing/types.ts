export interface MissingResult {
  missingMessages: string[];
  missingReplacements: Array<{ key: string; name: string }>;
  missingRich: Array<{ key: string; tag: string }>;
}
