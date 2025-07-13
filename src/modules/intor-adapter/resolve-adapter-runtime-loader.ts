import { nextClientRuntime } from "@/adapters/next-client/next-client-runtime/next-client-runtime";
import { nextServerRuntime } from "@/adapters/next-server/next-server-runtime";
import {
  IntorAdapterRuntimeOptions,
  IntorAdapterRuntime,
} from "@/modules/intor-adapter/types";

export const resolceAdapterRuntimeLoader = async ({
  config,
}: IntorAdapterRuntimeOptions): Promise<IntorAdapterRuntime> => {
  const { adapter } = config;

  let loadedRuntime;
  if (adapter === "next-client") {
    loadedRuntime = nextClientRuntime;
  } else if (adapter === "next-server") {
    loadedRuntime = nextServerRuntime;
  }

  return loadedRuntime as IntorAdapterRuntime;
};
