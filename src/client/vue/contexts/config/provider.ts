import type { IntorResolvedConfig } from "@/config";
import { computed, provide } from "vue";
import { ConfigContextKey } from "./context";

interface ProvideConfigProps {
  config: IntorResolvedConfig;
}

export function provideConfig(props: ProvideConfigProps) {
  const { config } = props;

  const value = computed(() => ({
    config,
  }));

  provide(ConfigContextKey, value);
}
