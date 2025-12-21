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
  };
  config1: {
    Locales: "en-US" | "zh-TW";
    Messages: {
      "{locale}": {
        hello: string;
        nested: { key: string };
      };
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
  };
};
