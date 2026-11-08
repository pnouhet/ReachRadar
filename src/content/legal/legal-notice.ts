import type { LegalDoc } from "./types";

export const legalNotice: LegalDoc = {
  slug: "legal-notice",
  title: "Legal notice",
  updated: "October 3, 2026",
  readMinutes: 2,
  intro: "Information required by French law (LCEN, article 6).",
  // Figma 09e has no help card.
  asideTitle: "",
  asideEmail: "",
  sections: [
    {
      id: "publisher",
      title: "Publisher",
      blocks: [
        {
          kind: "p",
          text: "[Company name] SAS, share capital of [amount] €, registered at the RCS of [city] under number [SIREN]. Registered office: [address], France. VAT: [FR number].",
        },
      ],
    },
    {
      id: "publication-director",
      title: "Publication director",
      blocks: [{ kind: "p", text: "[First name Last name], President." }],
    },
    {
      id: "hosting",
      title: "Hosting",
      blocks: [
        { kind: "p", text: "[Host name], [host address], [phone number]." },
      ],
    },
    {
      id: "contact",
      title: "Contact",
      blocks: [{ kind: "p", text: "hello@reachradar.com · [phone number]" }],
    },
    {
      id: "intellectual-property",
      title: "Intellectual property",
      blocks: [
        {
          kind: "p",
          text: "The ReachRadar name, logo and interface are protected. Tracks and artwork remain the property of their owners.",
        },
      ],
    },
  ],
};
