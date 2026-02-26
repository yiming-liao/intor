/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { get } from "svelte/store";
import { executeNavigation } from "../../../../src/client";
import { getIntorContext } from "../../../../src/client/svelte";
import { resolveOutbound } from "../../../../src/routing";
import { goto as svelteGoto } from "$app/navigation";
import { useNavigation } from "../../../../export/svelte-kit";

vi.mock("svelte/store", () => ({ get: vi.fn() }));
vi.mock("$app/navigation", () => ({ goto: vi.fn() }));
vi.mock("$app/state", () => ({ page: { url: { pathname: "/current" } } }));
vi.mock("../../../../src/client", () => ({ executeNavigation: vi.fn() }));
vi.mock("../../../../src/client/svelte", () => ({ getIntorContext: vi.fn() }));
vi.mock("../../../../src/routing", () => ({ resolveOutbound: vi.fn() }));

describe("useNavigation (SvelteKit)", () => {
  const config = { defaultLocale: "en" } as any;
  const setLocale = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (getIntorContext as any).mockReturnValue({
      config,
      locale: { subscribe: vi.fn() },
      setLocale,
    });
    (get as any).mockReturnValue("en");
    (resolveOutbound as any).mockReturnValue({
      destination: "/en/about",
    });
    (svelteGoto as any).mockResolvedValue(undefined);
  });

  it("goto resolves outbound and calls executeNavigation", async () => {
    const { goto } = useNavigation();
    await goto("/about");
    expect(resolveOutbound).toHaveBeenCalledWith(config, "en", "/current", {
      destination: "/about",
    });
    expect(executeNavigation).toHaveBeenCalledWith(
      { destination: "/en/about" },
      {
        config,
        currentLocale: "en",
        setLocale,
      },
    );
    expect(svelteGoto).toHaveBeenCalledWith("/en/about", {});
  });

  it("goto forwards explicit locale override", async () => {
    const { goto } = useNavigation();
    await goto("/about", { locale: "fr" });
    expect(resolveOutbound).toHaveBeenCalledWith(config, "en", "/current", {
      destination: "/about",
      locale: "fr",
    });
  });

  it("goto forwards svelte navigation options", async () => {
    const { goto } = useNavigation();
    await goto("/about", { replaceState: true });
    expect(svelteGoto).toHaveBeenCalledWith("/en/about", {
      replaceState: true,
    });
  });

  it("href returns resolved outbound destination", () => {
    const { href } = useNavigation();
    const result = href("/about");
    expect(resolveOutbound).toHaveBeenCalledWith(config, "en", "/current", {
      destination: "/about",
    });
    expect(result).toBe("/en/about");
  });
});
