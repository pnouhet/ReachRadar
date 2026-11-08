import type { LegalDoc } from "./types";

export const cookies: LegalDoc = {
  slug: "cookies",
  title: "Cookie policy",
  updated: "October 3, 2026",
  readMinutes: 4,
  intro:
    "Cookies help ReachRadar work and help us understand how it's used. Only the necessary ones are on by default. Everything else is your choice.",
  asideTitle: "Questions about cookies?",
  asideEmail: "privacy@reachradar.com",
  sections: [
    {
      id: "what-are-cookies",
      title: "What are cookies",
      blocks: [
        {
          kind: "p",
          text: "Cookies are small files stored by your browser. Some are essential to sign you in and keep your account secure. Others measure audience or personalise ads, and we only use those if you say yes.",
        },
      ],
    },
    {
      id: "preferences",
      title: "Your preferences",
      blocks: [{ kind: "preferences" }],
    },
    {
      id: "cookies-we-use",
      title: "Cookies we use",
      blocks: [
        {
          kind: "table",
          head: ["Name", "Provider", "Purpose", "Duration"],
          rows: [
            ["rr_session", "ReachRadar", "Keeps you signed in", "Session"],
            [
              "rr_consent",
              "ReachRadar",
              "Stores your cookie choices",
              "6 months",
            ],
            [
              "__stripe_mid",
              "Stripe",
              "Payment fraud prevention (necessary)",
              "1 year",
            ],
            ["_pk_id", "Matomo", "Anonymous audience measurement", "13 months"],
            ["_fbp", "Meta", "Ad measurement (marketing)", "3 months"],
          ],
        },
      ],
    },
    {
      id: "third-party-cookies",
      title: "Third-party cookies",
      blocks: [
        {
          kind: "p",
          text: "Stripe, Matomo and Meta set some of these cookies. Their own policies apply. Marketing cookies are only set after you accept them, and you can withdraw consent here at any time.",
        },
      ],
    },
    {
      id: "contact",
      title: "Contact",
      blocks: [
        {
          kind: "p",
          text: "Questions about cookies? Write to privacy@reachradar.com.",
        },
      ],
    },
  ],
};
