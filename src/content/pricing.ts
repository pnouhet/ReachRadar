/** Pricing page copy and data (Figma 06). */

export type Pack = {
  name: string;
  credits: number;
  pitches: number;
  price: number;
  perCredit: string;
  save?: number;
  popular?: boolean;
  features: string[];
};

export type FaqItem = { question: string; answer: string };

export const PRICING = {
  hero: {
    photo: "/pricing/hero.jpg",
    dots: "/brand/dots.png",
    eyebrow: ["Pricing", "Pay per pitch, no subscription"],
    title: "Buy credits",
    lead: "One credit system for every curator. Useful feedback within 7 days, or your credits come back.",
  },

  meta: {
    description:
      "One credit system for every curator. Pay per pitch, no subscription: useful feedback within 7 days, or your credits come back.",
  },

  how: {
    label: "How credits work",
    title: "1 pitch = 1 to 3 credits",
    text: "Each curator sets a price based on their audience. You see it before you pitch, and you only pay once they answer.",
  },

  costs: [
    {
      credits: 1,
      unit: "credit",
      text: "Music blogs and small playlists",
      icon: "newspaper",
    },
    {
      credits: 2,
      unit: "credits",
      text: "Spotify playlist curators",
      icon: "list-music",
    },
    {
      credits: 3,
      unit: "credits",
      text: "Labels and radio shows",
      icon: "radio",
    },
    {
      credits: 0,
      unit: "if no answer",
      text: "Same if the feedback is confirmed not useful",
      icon: "shield-check",
    },
  ] as const,

  packCard: {
    popular: "Most popular",
    save: "Save {n}%",
    pitches: "≈ {n} pitches",
    credits: "credits",
    perCredit: "per credit",
    buy: "Buy {n} credits",
  },

  packsIntro: {
    title: "Choose your pack",
    text: "The bigger the pack, the cheaper the credit. Prices include VAT.",
    newHere: "New here? 2 free credits after your first upload.",
  },

  packs: [
    {
      name: "Starter",
      credits: 10,
      pitches: 5,
      price: 12,
      perCredit: "1.20",
      features: [
        "Verified curators",
        "Useful feedback, or refunded",
        "7-day answer guarantee",
        "Credits never expire",
      ],
    },
    {
      name: "Artist",
      credits: 30,
      pitches: 15,
      price: 32,
      perCredit: "1.07",
      save: 11,
      popular: true,
      features: [
        "Everything in Starter",
        "Best value for a single release",
        "Track pitch results by curator",
        "Priority support",
      ],
    },
    {
      name: "Pro",
      credits: 75,
      pitches: 37,
      price: 76,
      perCredit: "1.01",
      save: 15,
      features: [
        "Everything in Artist",
        "Plan a full release campaign",
        "Placement reports",
        "Export pitch reports (CSV)",
      ],
    },
    {
      name: "Label",
      credits: 200,
      pitches: 100,
      price: 192,
      perCredit: "0.96",
      save: 20,
      features: [
        "Everything in Pro",
        "Up to 5 artist profiles",
        "Shared team access",
        "Invoices with VAT number",
      ],
    },
  ] satisfies Pack[],

  assurance: [
    { icon: "shield-check", text: "Secure payment, card details never stored" },
    { icon: "coins", text: "Purchased credits never expire" },
    { icon: "check", text: "Useful feedback or refunded" },
  ] as const,

  earn: {
    label: "Free credits",
    title: "Or earn them for free",
    text: "Rate 20 songs with honest written feedback and we add 2 bonus credits to your account. Up to 4 a month, usable on curators at 1 or 2 credits.",
    segments: 20,
    rated: 12,
    progress: "12 / 20 songs rated",
    reward: "+2 credits at 20",
    cta: { label: "Start rating songs", href: "/rate" },
    steps: [
      {
        icon: "headphones",
        title: "1. Listen",
        text: "Anonymous tracks, filtered by your genres.",
      },
      {
        icon: "star",
        title: "2. Rate & review",
        text: "4 criteria and 80+ characters of feedback.",
      },
      {
        icon: "coins",
        title: "3. Earn",
        text: "+2 credits every 20 ratings, up to 4 a month.",
      },
    ],
  },

  faqIntro: {
    label: "FAQ",
    title: "Questions about credits",
    text: "Can't find your answer? Our team replies within 24 hours.",
    contact: { label: "Contact support", href: "/legal/legal-notice#contact" },
  },

  faq: [
    {
      question: "Do credits expire?",
      answer:
        "Credits you buy never expire. Bonus credits (sign-up and Rate & Earn) stay valid as long as you're active: they only expire after 12 months without rating or pitching, and we remind you 30 days before.",
    },
    {
      question: "What if a curator doesn't answer?",
      answer:
        "You only pay once a curator answers. If there is no answer within 7 days, the curator isn't paid and your credits come back to you.",
    },
    {
      question: "Can I get a refund on unused credits?",
      answer:
        "Your credits come back if the feedback isn't useful or a curator doesn't answer within 7 days. Credits you buy never expire, so unused ones stay on your account. For anything else, contact support.",
    },
    {
      question: "How much does each curator cost?",
      answer:
        "Each curator sets a price of 1, 2 or 3 credits based on their audience: music blogs and small playlists are 1, Spotify playlist curators 2, labels and radio shows 3. You see the price before you pitch.",
    },
    {
      question: "Can I pay with PayPal or Apple Pay?",
      answer:
        "Yes. Payments are processed by Stripe, which accepts Visa, Mastercard, American Express, PayPal, Apple Pay and Google Pay. The methods available depend on your country and device.",
    },
    {
      question: "Do you issue invoices for labels?",
      answer:
        "The Label pack includes invoices with your VAT number. If you need anything else for your accounting, contact support.",
    },
  ] satisfies FaqItem[],

  payments: {
    label: "Payment methods",
    head: "Secure payment · processed by",
    processor: {
      name: "Stripe",
      logo: "/pricing/stripe.svg",
      width: 11.4,
      height: 16,
    },
    methods: [
      { name: "Visa", src: "/pricing/visa.svg", width: 49.5 },
      { name: "Mastercard", src: "/pricing/mastercard.svg", width: 38.8 },
      { name: "American Express", src: "/pricing/amex.svg", width: 28 },
      { name: "PayPal", src: "/pricing/paypal.svg", width: 20.4 },
      { name: "Apple Pay", src: "/pricing/apple-pay.svg", width: 46.9 },
      { name: "Google Pay", src: "/pricing/google-pay.svg", width: 55.4 },
    ],
    note: "Prices in EUR, VAT included. Local currency shown at checkout.",
  },
} as const;
