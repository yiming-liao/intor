import { run } from "./run";

// config
run("tsd __test__/types/config/fallback");
run("tsd __test__/types/config/generated");

// translator-instance
run("tsd __test__/types/translator-instance/fallback");
run("tsd __test__/types/translator-instance/generated");

// use-translator
run("tsd __test__/types/use-translator/fallback");
run("tsd __test__/types/use-translator/generated");

// get-translator
run("tsd __test__/types/get-translator/fallback");
run("tsd __test__/types/get-translator/generated");

// intor
run("tsd __test__/types/intor/fallback");
run("tsd __test__/types/intor/generated");
