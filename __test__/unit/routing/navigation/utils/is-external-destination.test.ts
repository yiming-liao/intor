import { describe, expect, it } from "vitest";
import { isExternalDestination } from "@/routing/navigation/utils/is-external-destination";

describe("isExternalDestination", () => {
  it("treats http URLs as external", () => {
    expect(isExternalDestination("http://example.com")).toBe(true);
    expect(isExternalDestination("https://example.com")).toBe(true);
  });

  it("treats custom schemes as external", () => {
    expect(isExternalDestination("mailto:test@example.com")).toBe(true);
    expect(isExternalDestination("tel:+123456789")).toBe(true);
    expect(isExternalDestination("myapp://open")).toBe(true);
  });

  it("treats relative paths as internal", () => {
    expect(isExternalDestination("/about")).toBe(false);
    expect(isExternalDestination("/en-US/about")).toBe(false);
  });

  it("treats query and hash paths as internal", () => {
    expect(isExternalDestination("?foo=bar")).toBe(false);
    expect(isExternalDestination("#section")).toBe(false);
  });

  it("treats protocol-relative URLs as external", () => {
    expect(isExternalDestination("//example.com")).toBe(false);
  });
});
