import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { Textarea } from "@/components/ui/Textarea";

describe("Button", () => {
  it("renders a link when given an href", () => {
    render(<Button variant="primary" href="/x">Go</Button>);
    expect(screen.getByRole("link", { name: "Go" })).toHaveAttribute("href", "/x");
  });

  it("is busy and disabled while loading", () => {
    render(<Button variant="primary" loading>Save</Button>);
    const btn = screen.getByRole("button", { name: /save/i });
    expect(btn).toHaveAttribute("aria-busy", "true");
    expect(btn).toBeDisabled();
  });
});

describe("Input", () => {
  it("links its error message and marks itself invalid", () => {
    render(<Input label="Email" name="email" error="Required" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Required");
  });
});

describe("Textarea", () => {
  it("shows a live character count against the maximum", async () => {
    render(<Textarea label="Bio" name="bio" maxLength={300} showCount />);
    await userEvent.type(screen.getByLabelText("Bio"), "hello");
    expect(screen.getByText("5 / 300")).toBeInTheDocument();
  });
});

describe("Chip", () => {
  it("exposes its active state when clickable", () => {
    render(<Chip active onClick={() => {}}>House</Chip>);
    expect(screen.getByRole("button", { name: "House" })).toHaveAttribute("aria-pressed", "true");
  });
});

describe("Switch", () => {
  it("is a switch that reports the next value", async () => {
    const onChange = vi.fn();
    render(<Switch label="Open to collabs" checked={false} onChange={onChange} />);
    await userEvent.click(screen.getByRole("switch", { name: "Open to collabs" }));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});

describe("Avatar", () => {
  it("falls back to initials without an image", () => {
    render(<Avatar name="Ilan Mercier" size={44} />);
    expect(screen.getByText("IM")).toBeInTheDocument();
  });

  it("keeps accented initials", () => {
    render(<Avatar name="Éloïse" size={44} />);
    expect(screen.getByText("É")).toBeInTheDocument();
  });
});
