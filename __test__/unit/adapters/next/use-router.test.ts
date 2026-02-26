/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useRouter as useNextRouter, usePathname } from "next/navigation";
import { useRouter } from "../../../../src/adapters/next/use-router";
import { executeNavigation } from "../../../../src/client";
import { useIntorContext } from "../../../../src/client/react";
import { resolveOutbound } from "../../../../src/routing";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}));
vi.mock("../../../../src/client", () => ({ executeNavigation: vi.fn() }));
vi.mock("../../../../src/client/react", () => ({ useIntorContext: vi.fn() }));
vi.mock("../../../../src/routing", () => ({ resolveOutbound: vi.fn() }));

describe("useRouter (Next.js adapter)", () => {
  const mockPush = vi.fn();
  const mockReplace = vi.fn();
  const mockPrefetch = vi.fn();
  const mockBack = vi.fn();
  const mockForward = vi.fn();
  const mockRefresh = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useNextRouter as any).mockReturnValue({
      push: mockPush,
      replace: mockReplace,
      prefetch: mockPrefetch,
      back: mockBack,
      forward: mockForward,
      refresh: mockRefresh,
    });

    (usePathname as any).mockReturnValue("/current");

    (useIntorContext as any).mockReturnValue({
      config: { some: "config" },
      locale: "en",
      setLocale: vi.fn(),
    });
  });

  describe("push", () => {
    it("resolves outbound and commits navigation", () => {
      (resolveOutbound as any).mockReturnValue({
        destination: "/en/about",
        kind: "client",
      });
      const router = useRouter();
      router.push("/about");
      expect(resolveOutbound).toHaveBeenCalledWith(
        { some: "config" },
        "en",
        "/current",
        { destination: "/about" },
      );
      expect(executeNavigation).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("/en/about");
    });

    it("strips locale from options", () => {
      (resolveOutbound as any).mockReturnValue({
        destination: "/fr/about",
        kind: "client",
      });
      const router = useRouter();
      router.push("/about", { locale: "fr", scroll: false });
      expect(mockPush).toHaveBeenCalledWith("/fr/about", {
        scroll: false,
      });
    });
  });

  describe("replace", () => {
    it("resolves outbound and commits navigation", () => {
      (resolveOutbound as any).mockReturnValue({
        destination: "/en/profile",
        kind: "client",
      });
      const router = useRouter();
      router.replace("/profile");
      expect(executeNavigation).toHaveBeenCalledTimes(1);
      expect(mockReplace).toHaveBeenCalledWith("/en/profile");
    });

    it("strips locale from options", () => {
      (resolveOutbound as any).mockReturnValue({
        destination: "/fr/profile",
        kind: "client",
      });
      const router = useRouter();
      router.replace("/profile", { locale: "fr", scroll: false });
      expect(mockReplace).toHaveBeenCalledWith("/fr/profile", {
        scroll: false,
      });
    });
  });

  describe("prefetch", () => {
    it("does NOT commit navigation", () => {
      (resolveOutbound as any).mockReturnValue({
        destination: "/en/about",
        kind: "client",
      });
      const router = useRouter();
      router.prefetch("/about");
      expect(executeNavigation).not.toHaveBeenCalled();
      expect(mockPrefetch).toHaveBeenCalledWith("/en/about");
    });

    it("strips locale from options", () => {
      (resolveOutbound as any).mockReturnValue({
        destination: "/fr/about",
        kind: "client",
      });
      const router = useRouter();
      router.prefetch("/about", {
        locale: "fr",
        kind: "auto" as any,
      });
      expect(executeNavigation).not.toHaveBeenCalled();
      expect(mockPrefetch).toHaveBeenCalledWith("/fr/about", {
        kind: "auto",
      });
    });

    it("ignores non-client destinations", () => {
      (resolveOutbound as any).mockReturnValue({
        destination: "https://external.com",
        kind: "external",
      });
      const router = useRouter();
      router.prefetch("https://external.com");
      expect(mockPrefetch).not.toHaveBeenCalled();
      expect(executeNavigation).not.toHaveBeenCalled();
    });
  });

  describe("router passthrough methods", () => {
    it("forwards back/forward/refresh", () => {
      const router = useRouter();
      router.back();
      router.forward();
      router.refresh();
      expect(mockBack).toHaveBeenCalled();
      expect(mockForward).toHaveBeenCalled();
      expect(mockRefresh).toHaveBeenCalled();
    });
  });
});
