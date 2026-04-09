// discover-configs
export { discoverConfigs, type ConfigEntry } from "./discover-configs";

// collect-messages
export {
  collectMessages,
  collectNonDefaultLocaleMessages,
  type ReaderOptions,
  type MergeOverrides,
} from "./collect-messages";

// infer-schema
export {
  inferShapes,
  type InferNode,
  type InferredShapes,
  extractInterpolationNames,
} from "./infer-shape";

// extract-usages
export {
  extractUsages,
  type ExtractUsagesOptions,
  type ExtractedUsages,
  type TranslatorFactory,
  type TranslatorMethod,
  type ReplacementUsage,
  type PreKeyUsage,
  type KeyUsage,
  type RichUsage,
} from "./extract-usages";

// artifacts
export {
  buildTypes,
  buildSchema,
  prepareSchema,
  type GeneratedSchema,
  type SchemaEntry,
} from "./artifacts";
