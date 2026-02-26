// @vitest-environment jsdom

import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, provide, computed, h } from "vue";
import { IntorContextKey } from "../../../../../src/client/vue/provider/intor-provider";
import { injectIntorContext } from "../../../../../src/client/vue/provider/inject-intor-context";

describe("injectIntor (vue)", () => {
  it("returns context when used inside provider", () => {
    const Child = defineComponent({
      setup() {
        const ctx = injectIntorContext();
        if ((ctx.value as any).test !== true) {
          throw new Error("Context not injected properly");
        }
        return () => null;
      },
    });

    const Parent = defineComponent({
      setup() {
        provide(
          IntorContextKey,
          computed(() => ({ test: true }) as any),
        );
        return () => h(Child);
      },
    });
    expect(() => mount(Parent)).not.toThrow();
  });

  it("throws when used outside provider", () => {
    const Child = defineComponent({
      setup() {
        injectIntorContext();
        return () => null;
      },
    });
    expect(() => mount(Child)).toThrow(
      "injectIntorContext must be used within IntorProvider",
    );
  });
});
