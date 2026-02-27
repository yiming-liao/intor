// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { Link } from "../../../../src/adapters/next/link";
import { usePathname } from "next/navigation";
import { formatUrl } from "next/dist/shared/lib/router/utils/format-url";
import { useIntorContext } from "../../../../src/client/react";
import { resolveOutbound } from "../../../../src/routing";
import { executeNavigation } from "../../../../src/client";

vi.mock("next/link", () => ({
  default: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));
vi.mock("next/navigation", () => ({ usePathname: vi.fn() }));
vi.mock("next/dist/shared/lib/router/utils/format-url", () => ({
  formatUrl: vi.fn(),
}));
vi.mock("../../../../src/client/react", () => ({ useIntorContext: vi.fn() }));
vi.mock("../../../../src/routing", () => ({ resolveOutbound: vi.fn() }));
vi.mock("../../../../src/client", () => ({ executeNavigation: vi.fn() }));

describe("Next Link adapter", () => {
  const mockConfig = { defaultLocale: "en" } as any;

  beforeEach(() => {
    vi.clearAllMocks();
    (usePathname as any).mockReturnValue("/current");
    (useIntorContext as any).mockReturnValue({
      config: mockConfig,
      locale: "en",
      setLocale: vi.fn(),
    });
    (resolveOutbound as any).mockReturnValue({
      destination: "/resolved",
      type: "client",
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("resolves outbound with string href", () => {
    render(<Link href="/about">About</Link>);
    expect(resolveOutbound).toHaveBeenCalledWith(mockConfig, "en", "/current", {
      destination: "/about",
    });
  });

  it("normalizes object href via formatUrl", () => {
    (formatUrl as any).mockReturnValue("/formatted");
    render(<Link href={{ pathname: "/about" } as any}>About</Link>);
    expect(formatUrl).toHaveBeenCalled();
    expect(resolveOutbound).toHaveBeenCalledWith(mockConfig, "en", "/current", {
      destination: "/formatted",
    });
  });

  it("passes locale override to resolveOutbound", () => {
    render(
      <Link href="/about" locale="fr">
        About
      </Link>,
    );
    expect(resolveOutbound).toHaveBeenCalledWith(mockConfig, "en", "/current", {
      destination: "/about",
      locale: "fr",
    });
  });

  it("executes navigation on click", () => {
    const { getByText } = render(<Link href="/about">About</Link>);
    fireEvent.click(getByText("About"));
    expect(executeNavigation).toHaveBeenCalledWith(
      { destination: "/resolved", type: "client" },
      expect.objectContaining({
        config: mockConfig,
        currentLocale: "en",
      }),
      expect.any(Object),
    );
  });

  it("does not execute navigation if event.defaultPrevented", () => {
    const { getByText } = render(
      <Link href="/about" onClick={(e) => e.preventDefault()}>
        About
      </Link>,
    );
    fireEvent.click(getByText("About"));
    expect(executeNavigation).not.toHaveBeenCalled();
  });

  it("calls user onClick before navigation", () => {
    const onClick = vi.fn();
    const { getByText } = render(
      <Link href="/about" onClick={onClick}>
        About
      </Link>,
    );
    fireEvent.click(getByText("About"));
    expect(onClick).toHaveBeenCalled();
    expect(executeNavigation).toHaveBeenCalled();
  });

  it("does not pass destination when href is undefined", () => {
    render(<Link>About</Link>);
    expect(formatUrl).not.toHaveBeenCalled();
    expect(resolveOutbound).toHaveBeenCalledWith(
      mockConfig,
      "en",
      "/current",
      {},
    );
  });
});
