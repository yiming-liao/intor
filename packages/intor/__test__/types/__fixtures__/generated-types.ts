export type GeneratedTypesFixture = {
  __intor_generated__: true;
  __default__: {
    Locales: "en-US" | "zh-TW";
    Messages: {
      "{locale}": {
        hello: string;
        nested: { key: string };
      };
    };
    Replacements: {
      "{locale}": { hello: { name: string } };
    };
    Rich: {
      "{locale}": { hello: { a: Record<string, never> } };
    };
  };
  "sitero-web-client": {
    Locales: "zh-TW" | "en-US";
    Messages: { "{locale}": unknown };
    Replacements: { "{locale}": unknown };
    Rich: { "{locale}": Record<string, never> };
  };
  config1: {
    Locales: "en-US" | "zh-TW";
    Messages: {
      "{locale}": {
        hello: string;
        nested: { key: string };
      };
    };
    Replacements: {
      "{locale}": { hello: { name: string } };
    };
    Rich: {
      "{locale}": { hello: { a: Record<string, never> } };
    };
  };
  config2: {
    Locales: "en-US" | "fr-FR";
    Messages: {
      "{locale}": {
        hello: string;
        nested: { key: string };
        nested2: { a: { b: { c: { d: string } } } };
      };
    };
    Replacements: {
      "{locale}": { hello: { name: string } };
    };
    Rich: {
      "{locale}": { hello: { a: Record<string, never> } };
    };
  };
};
