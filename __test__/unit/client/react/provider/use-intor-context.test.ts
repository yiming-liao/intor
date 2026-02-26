// @vitest-environment jsdom

import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import React from "react";
import { useIntorContext } from "../../../../../src/client/react/provider/use-intor-context";
import { IntorContext } from "../../../../../src/client/react/provider/intor-provider";

describe("useIntorContext", () => {
  it("returns context value when inside provider", () => {
    const wrapper = ({ children }: any) =>
      React.createElement(
        IntorContext.Provider,
        { value: { test: true } as any },
        children,
      );

    const { result } = renderHook(() => useIntorContext(), { wrapper });

    expect(result.current).toEqual({ test: true });
  });

  it("throws when used outside provider", () => {
    expect(() => {
      renderHook(() => useIntorContext());
    }).toThrow("useIntorContext must be used within IntorProvider");
  });
});
