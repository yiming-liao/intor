export interface LoadLocalMessagesOptions {
  basePath?: string | null;
  locale?: string | null;
  fallbackLocales?: string[];
  namespaces?: string[];
  concurrency?: number;
  configId?: string | null;
}
