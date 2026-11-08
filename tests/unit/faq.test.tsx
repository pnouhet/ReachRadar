import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Faq } from "@/components/pricing/Faq";

const items = [
  { question: "Do credits expire?", answer: "Never, for bought credits." },
  {
    question: "What if a curator doesn't answer?",
    answer: "You get them back.",
  },
  { question: "Other?", answer: "Other answer." },
];

describe("Faq", () => {
  it("opens the first question by default", () => {
    render(<Faq items={items} />);
    const first = screen.getByRole("button", { name: "Do credits expire?" });
    expect(first).toHaveAttribute("aria-expanded", "true");
    expect(first).toHaveAttribute("aria-controls");
    expect(screen.getByText("Never, for bought credits.")).toBeVisible();
    expect(screen.getByRole("button", { name: "Other?" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("opens one at a time", async () => {
    const user = userEvent.setup();
    render(<Faq items={items} />);
    await user.click(
      screen.getByRole("button", { name: "What if a curator doesn't answer?" }),
    );
    expect(
      screen.getByRole("button", { name: "What if a curator doesn't answer?" }),
    ).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("button", { name: "Do credits expire?" }),
    ).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("You get them back.")).toBeVisible();
    expect(screen.queryByText("Never, for bought credits.")).not.toBeVisible();
  });

  it("closes the open question when clicked again", async () => {
    const user = userEvent.setup();
    render(<Faq items={items} />);
    const first = screen.getByRole("button", { name: "Do credits expire?" });
    await user.click(first);
    expect(first).toHaveAttribute("aria-expanded", "false");
  });
});
