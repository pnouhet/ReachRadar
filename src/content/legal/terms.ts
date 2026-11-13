import type { LegalDoc } from "./types";

export const terms: LegalDoc = {
  slug: "terms",
  title: "Terms of use",
  updated: "October 14, 2026",
  readMinutes: 13,
  intro:
    "These terms set the rules for artists, curators and ReachRadar. By creating an account, you agree to them.",
  asideTitle: "Questions about these terms?",
  asideEmail: "legal@reachradar.com",
  sections: [
    {
      id: "accounts",
      title: "Accounts",
      blocks: [
        {
          kind: "p",
          text: "You must be 18 or older and give accurate information. One person, one account. You are responsible for what happens on your account.",
        },
      ],
    },
    {
      id: "credits-and-payments",
      title: "Credits and payments",
      blocks: [
        {
          kind: "list",
          items: [
            "1 credit has a list price of €1.20 incl. VAT. Packs give up to 20% off.",
            "A pitch costs 1 to 3 credits, shown before you send.",
            "Credits are held when you send a pitch and only spent when a curator answers. Without an answer within 7 days, they are refunded.",
            "You get 2 bonus credits once your email is verified and your first track is uploaded, then up to 4 per month by rating songs. They expire after 12 months without any rating or pitch; purchased credits never expire.",
            "Bonus credits are spent first and can only be used on curators priced at 1 or 2 credits. They can't be refunded or transferred. Unused purchased credits can be refunded within [refund conditions].",
          ],
        },
      ],
    },
    {
      id: "curators",
      title: "Curators",
      blocks: [
        {
          kind: "list",
          items: [
            "Curators are paid €0.45 per credit for every answer, accepted or declined.",
            "Every answer must include honest, specific written feedback (80 characters min.).",
            "Curators must never charge for a placement or guarantee one.",
            "Withdrawals start from €20.",
            "Artists rate every answer. An answer rated Not useful can be disputed: we review it within 48 hours, up to 3 disputes per month. If the dispute is upheld, the credits go back to the artist and the curator is not paid.",
            "The Verified badge requires an audience audit every 90 days, answers on time and a Feedback score above our threshold. A curator who misses one of these loses the badge.",
          ],
        },
      ],
    },
    {
      id: "your-music",
      title: "Your music",
      blocks: [
        {
          kind: "p",
          text: "You keep all rights to your tracks. You give ReachRadar a limited licence to host and play them for the curators and artists you choose.",
        },
      ],
    },
    {
      id: "community-rules",
      title: "Community rules",
      blocks: [
        {
          kind: "p",
          text: "No harassment, hate speech, fake streams, bots or spam. We may suspend accounts that break these rules.",
        },
      ],
    },
    {
      id: "liability-and-changes",
      title: "Liability and changes",
      blocks: [
        {
          kind: "p",
          text: "ReachRadar does not guarantee placements, streams or signings. We will notify you 30 days before any important change to these terms.",
        },
      ],
    },
  ],
};
