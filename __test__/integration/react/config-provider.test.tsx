import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useConfig } from "@/client/react/contexts/config";
import { ConfigProvider } from "@/client/react/contexts/config/provider";

const mockConfig = { id: "test-app" } as IntorResolvedConfig;

describe("ConfigProvider (integration)", () => {
  it("provides config value to consumers", () => {
    let receivedConfig: IntorResolvedConfig | undefined;

    function Consumer() {
      const { config } = useConfig();
      receivedConfig = config;
      return null;
    }

    render(
      <ConfigProvider value={{ config: mockConfig }}>
        <Consumer />
      </ConfigProvider>,
    );

    expect(receivedConfig).toBeDefined();
    expect(receivedConfig).toBe(mockConfig);
  });
});
