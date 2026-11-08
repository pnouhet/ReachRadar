import type { LegalDoc } from "./types";

export const privacy: LegalDoc = {
  slug: "privacy",
  title: "Privacy policy",
  updated: "October 3, 2026",
  readMinutes: 8,
  intro:
    "Your music and your data belong to you. This policy explains, in plain words, what we collect, why, and how you stay in control.",
  asideTitle: "Questions about your data?",
  asideEmail: "privacy@reachradar.com",
  sections: [
    {
      id: "who-we-are",
      title: "Who we are",
      blocks: [
        {
          kind: "p",
          text: "ReachRadar is operated by [Company name] SAS, [registered address], France (“ReachRadar”, “we”). We are the data controller for the personal data processed on reachradar.com and in our apps.",
        },
      ],
    },
    {
      id: "what-data-we-collect",
      title: "What data we collect",
      blocks: [
        { kind: "p", text: "We only collect what we need to run the service:" },
        {
          kind: "list",
          items: [
            "Account data: name, email, password (hashed), account type.",
            "Profile and music: tracks, artwork, genres, links, bio.",
            "Activity: pitches, ratings, feedback, messages, collabs.",
            "Payments: handled by Stripe. We never see or store your card number.",
            "Technical data: IP address, device, cookies (see our Cookie policy).",
          ],
        },
      ],
    },
    {
      id: "how-we-use-your-data",
      title: "How we use your data",
      blocks: [
        {
          kind: "list",
          items: [
            "Deliver your pitches and match your tracks with the right curators.",
            "Pay curators, process refunds and issue invoices.",
            "Keep the community safe: moderation, fraud and spam detection.",
            "Send service emails. Newsletters only with your consent.",
          ],
        },
      ],
    },
    {
      id: "legal-bases",
      title: "Legal bases",
      blocks: [
        {
          kind: "p",
          text: "We process data to perform our contract with you, to meet legal obligations (accounting, tax), on our legitimate interest (security, product improvement) and, for marketing and analytics cookies, on your consent.",
        },
      ],
    },
    {
      id: "who-we-share-it-with",
      title: "Who we share it with",
      blocks: [
        {
          kind: "p",
          text: "Curators you pitch see your track, your public profile and your story. We also use trusted processors for payments (Stripe), hosting (in the EU) and email. We never sell your data.",
        },
      ],
    },
    {
      id: "how-long-we-keep-it",
      title: "How long we keep it",
      blocks: [
        {
          kind: "p",
          text: "Account data is kept while your account is active and deleted 3 years after your last activity. Invoices are kept 10 years, as required by French law.",
        },
      ],
    },
    {
      id: "your-rights",
      title: "Your rights",
      blocks: [
        {
          kind: "p",
          text: "You can access, correct, export or delete your data, object to its processing or withdraw consent at any time. If you think we got it wrong, you can complain to the CNIL (cnil.fr).",
        },
        {
          kind: "callout",
          text: "Manage your data in Settings → Privacy, or write to privacy@reachradar.com. We answer within 30 days.",
        },
      ],
    },
    {
      id: "security",
      title: "Security",
      blocks: [
        {
          kind: "p",
          text: "Data is encrypted in transit and at rest, access is limited to the team members who need it, and we run regular security reviews.",
        },
      ],
    },
    {
      id: "contact",
      title: "Contact",
      blocks: [
        {
          kind: "p",
          text: "Data protection officer: [Name], privacy@reachradar.com, [Company name] SAS, [registered address], France.",
        },
      ],
    },
  ],
};
