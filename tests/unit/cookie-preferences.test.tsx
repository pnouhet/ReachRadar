import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const writeConsent = vi.fn();
vi.mock("@/lib/consent", async (orig) => ({
  ...(await orig<typeof import("@/lib/consent")>()),
  writeConsent: (c: unknown) => writeConsent(c),
}));

import { CookiePreferences } from "@/components/site/CookiePreferences";

beforeEach(() => writeConsent.mockClear());

describe("CookiePreferences", () => {
  it("saves the toggled choices", async () => {
    const user = userEvent.setup();
    render(<CookiePreferences initial={null} />);
    await user.click(screen.getByRole("switch", { name: "Analytics" }));
    await user.click(screen.getByRole("button", { name: "Save my choices" }));
    expect(writeConsent).toHaveBeenCalledWith({
      analytics: true,
      marketing: false,
    });
    expect(screen.getByRole("status")).toHaveTextContent(
      "Your choices are saved for 6 months. We'll ask again after that.",
    );
  });

  it("rejects all", async () => {
    const user = userEvent.setup();
    render(
      <CookiePreferences initial={{ analytics: true, marketing: true }} />,
    );
    await user.click(screen.getByRole("button", { name: "Reject all" }));
    expect(writeConsent).toHaveBeenCalledWith({
      analytics: false,
      marketing: false,
    });
  });

  it("accepts all", async () => {
    const user = userEvent.setup();
    render(<CookiePreferences initial={null} />);
    await user.click(screen.getByRole("button", { name: "Accept all" }));
    expect(writeConsent).toHaveBeenCalledWith({
      analytics: true,
      marketing: true,
    });
  });
});
