import { run } from "./run";

// config
run("tsd __test__/types/config/fallback");
run("tsd __test__/types/config/generated");

// translator-instance
run("tsd __test__/types/translator-instance/fallback");
run("tsd __test__/types/translator-instance/generated");
