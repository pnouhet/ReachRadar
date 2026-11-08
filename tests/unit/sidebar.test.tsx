import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth/actions", () => ({ signOut: vi.fn() }));
const { AppSidebar } = await import("@/components/app/AppSidebar");

describe("AppSidebar", () => {
  it("marks the section of the current page as active for artists", () => {
    render(<AppSidebar role="artist" pathname="/pitch/step-2" />);
    const nav = screen.getByRole("navigation", { name: "Main" });
    expect(within(nav).getByRole("link", { name: /Pitch to curators/ })).toHaveAttribute("aria-current", "page");
    expect(within(nav).getByRole("link", { name: /Dashboard/ })).not.toHaveAttribute("aria-current");
    expect(within(nav).queryByRole("link", { name: /Inbox/ })).toBeNull();
  });

  it("shows curator entries and hides artist-only ones for curators", () => {
    render(<AppSidebar role="curator" pathname="/inbox" />);
    const nav = screen.getByRole("navigation", { name: "Main" });
    for (const label of [/Inbox/, /My Playlists/, /Earnings/]) {
      expect(within(nav).getByRole("link", { name: label })).toBeInTheDocument();
    }
    expect(within(nav).queryByRole("link", { name: /Rate & earn/ })).toBeNull();
  });

  it("offers a log out button", () => {
    render(<AppSidebar role="artist" pathname="/dashboard" />);
    expect(screen.getByRole("button", { name: "Log out" })).toBeInTheDocument();
  });
});
