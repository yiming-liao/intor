import { run } from "./run";

// config
run("tsd __test__/types/config/fallback");
run("tsd __test__/types/config/generated");

// base-translator
run("tsd __test__/types/base-translator/fallback");
run("tsd __test__/types/base-translator/generated");

// frameworks
run("tsd __test__/types/frameworks/fallback");
run("tsd __test__/types/frameworks/generated");
