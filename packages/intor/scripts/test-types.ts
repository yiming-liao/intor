import { run } from "./run";

// config
run("tsd __test__/types/config/fallback");
run("tsd __test__/types/config/generated");

// translator
run("tsd __test__/types/translator/fallback");
run("tsd __test__/types/translator/generated");
