import type { LegalDoc } from "./types";

export const gdpr: LegalDoc = {
  slug: "gdpr",
  title: "GDPR",
  updated: "October 3, 2026",
  readMinutes: 5,
  intro:
    "ReachRadar is built in France and follows the EU General Data Protection Regulation. Here is how we apply it, and how to use your rights in two clicks.",
  asideTitle: "Questions about your data?",
  asideEmail: "privacy@reachradar.com",
  sections: [
    {
      id: "our-commitments",
      title: "Our commitments",
      blocks: [
        {
          kind: "list",
          items: [
            "Collect only what the service needs.",
            "Store data in the EU.",
            "Never sell personal data.",
            "Answer every request within 30 days.",
          ],
        },
      ],
    },
    {
      id: "your-rights-at-a-glance",
      title: "Your rights at a glance",
      blocks: [
        {
          kind: "list",
          items: [
            "Access: download a copy of your data.",
            "Rectification: fix anything that's wrong.",
            "Erasure: delete your account and data.",
            "Portability: export your tracks and history.",
            "Objection: refuse analytics or marketing.",
          ],
        },
      ],
    },
    {
      id: "how-to-make-a-request",
      title: "How to make a request",
      blocks: [
        {
          kind: "p",
          text: "In Settings → Privacy, choose the right you want to use. You can also write to privacy@reachradar.com. We may ask you to confirm your identity.",
        },
      ],
    },
    {
      id: "processors-and-transfers",
      title: "Processors and transfers",
      blocks: [
        {
          kind: "p",
          text: "Our processors (Stripe, hosting, email) are bound by GDPR contracts. If data leaves the EU, it is covered by Standard Contractual Clauses.",
        },
      ],
    },
    {
      id: "supervisory-authority",
      title: "Supervisory authority",
      blocks: [
        {
          kind: "p",
          text: "You can contact the CNIL, the French data protection authority, at cnil.fr.",
        },
      ],
    },
  ],
};
