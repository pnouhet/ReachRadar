/** Home page copy and demo data (Figma 01 / prototype/index.html). */

export type HomeImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
};
export type AvatarTone = "cyan" | "rose" | "slate";

export const HOME = {
  hero: {
    title: "ReachRadar",
    photo: "/brand/hero-bg.jpg",
    dots: "/brand/dots.png",
    lead: [
      "Pitch your tracks to Spotify curators, labels, radios and blogs.",
      "Get honest feedback from artists. Grow real fans.",
    ],
    primary: { label: "Start pitching", href: "/signup" },
    secondary: { label: "Rate songs, earn credits", href: "/rate" },
    scroll: { label: "Scroll down", icon: "/home/arrow-drop-down.svg" },
  },

  intro: {
    id: "get-heard",
    badge: "01",
    title: "Get heard by new fans",
    text: "Introducing the latest music platform designed to help artists find new fans ! This innovative platform offers a unique approach to music discovery, connecting artists with listeners who appreciate their style and genre. With a sophisticated algorithm that analyzes listening habits and preferences, the platform matches artists with the right audience, increasing exposure and engagement. It's easy to use and offers a range of tools to help artists promote their music, from customizable profiles to targeted marketing campaigns. With this platform, artists can finally reach their full potential and find the audience they deserve.",
  },

  stats: [
    { value: 800, prefix: "+", suffix: "", label: "Submitted songs" },
    { value: 2, prefix: "+", suffix: "k", label: "Satisfied clients" },
    { value: 473, prefix: "", suffix: "", label: "New fans per tracks" },
    { value: 9, prefix: "", suffix: "", label: "Artists awards" },
  ],

  live: {
    quoteMark: "/home/quote-left.svg",
    title: ["Go ahead,", "live from", "your music !"],
    text: [
      "We help artists in their music career. Sometimes the",
      "artists we coached gets awards or build impressive fanbase.",
      "Now flying the flag for the next best songs that tells stories.",
    ],
    image: {
      src: "/home/live-crowd.png",
      width: 1174,
      height: 1000,
      alt: "A crowd raising hands in front of a stage lit in blue",
    } satisfies HomeImage,
    tabs: ["Teaser trailer", "How it works"],
  },

  promisesHead: {
    badge: "02",
    title: "Three promises",
    sub: "Pitch smarter. Pay only for real feedback. Grow real fans.",
    cta: { label: "Create your free account", href: "/signup" },
  },
  promises: [
    {
      icon: "shield-check",
      num: "01",
      title: "Useful or refunded",
      text: "Rate every answer. Generic feedback can be disputed, reviewed in 48 h, and your credits come back.",
    },
    {
      icon: "headphones",
      num: "02",
      title: "Test before you pitch",
      text: "Every song you rate earns your track an anonymous rating. Get a Readiness score before you spend a credit.",
    },
    {
      icon: "trending-up",
      num: "03",
      title: "Real fans",
      text: "Verified curators, audience audited every 90 days. Each placement comes with a report and estimated streams.",
    },
  ] as const,

  categoriesHead: {
    badge: "03",
    title: ["Pitch to the", "right ears"],
    sub: "2 180 Verified curators, audience audited every 90 days. Every one shows a public Feedback score.",
    fade: "/home/fade.svg",
    cta: { label: "Browse all curators", href: "/catalogue" },
  },
  categories: [
    {
      title: "Spotify playlists",
      meta: "1 240 curators · from 1 credit · 92% useful",
      href: "/catalogue",
      badge: "/home/badge-playlists.svg",
      image: {
        src: "/home/cat-playlists.png",
        width: 611,
        height: 707,
        alt: "Concert crowd under purple lights",
      },
    },
    {
      title: "Labels",
      meta: "310 labels · from 3 credits · 88% useful",
      href: "/catalogue",
      badge: "/home/badge-labels.svg",
      image: {
        src: "/home/cat-labels.png",
        width: 611,
        height: 707,
        alt: "Artist raising a hand under cyan laser lights",
      },
    },
    {
      title: "Radios",
      meta: "180 radios · from 2 credits · 90% useful",
      href: "/catalogue",
      badge: "/home/badge-radios.svg",
      image: {
        src: "/home/cat-radios.png",
        width: 611,
        height: 707,
        alt: "Hands on a radio mixing console",
      },
    },
    {
      title: "Blogs & media",
      meta: "450 blogs · from 1 credit · 94% useful",
      href: "/catalogue",
      badge: "/home/badge-blogs.svg",
      image: {
        src: "/home/cat-blogs.png",
        width: 611,
        height: 707,
        alt: "Hands typing on a laptop",
      },
    },
  ] satisfies {
    title: string;
    meta: string;
    href: string;
    badge: string;
    image: HomeImage;
  }[],

  preTest: {
    badge: "04",
    title: "Test before you pitch",
    text: "Before you spend a single credit, artists from your genre rate your track anonymously. At 20 ratings you get a readiness score out of 100, the 4 criteria and the comment that comes up most. Fix the mix first, then pitch the curators most likely to say yes.",
    benefits: [
      "Free: every song you rate earns your track a rating back",
      "Anonymous: honest ears, no friends’ bias",
      "Smarter pitch: your score powers curator matching",
    ],
    cta: { label: "Pre-test a track for free", href: "/signup" },
    card: {
      title: "Track readiness",
      tag: "Pre-test",
      track: "Neon Rain · Melodic techno · 124 BPM",
      status: "Ready to pitch",
      score: 78,
      max: "/ 100",
      progress: "17 / 20 anonymous ratings received · 3 more for a final score",
      criteria: [
        { name: "Production", value: "4.3", bar: "/home/score-4.svg" },
        { name: "Melody", value: "4.0", bar: "/home/score-4.svg" },
        { name: "Vocals", value: "3.6", bar: "/home/score-vocals.svg" },
        { name: "Originality", value: "4.4", bar: "/home/score-4.svg" },
      ],
      quote: "“The drop at 0:42 really lands, but the intro feels a bit long.”",
      quoteMeta: "Most mentioned in 6 of 17 comments",
      unlocked: "Unlocked: 24 curators matched, best at 94%",
      matches: { label: "See matches", href: "/catalogue" },
    },
  },

  rateEarn: {
    badge: "05",
    title: ["Rate &", "earn"],
    text: "Listen to anonymous tracks from other artists, filter by genre, BPM or mood, and leave honest, constructive feedback. Rate 20 songs and we give you 2 free pitch credits.",
    benefits: [
      "100% anonymous: no names, no bias, only the music",
      "Feedback is moderated, so every rating is useful",
      "Each rating earns your own track a rating back (Pre-test)",
    ],
    progress: {
      label: "12 / 20 songs rated",
      reward: "+2 credits at 20",
      total: 20,
      done: 12,
    },
    cta: { label: "Start rating songs", href: "/rate" },
    player: {
      track: "Anonymous track #4821",
      position: "Track 13 of 20",
      chips: ["Hip-hop", "92 BPM", "Dark", "Melancholic"],
      playIcon: "/home/play-square.svg",
      playLabel: "Play track",
      elapsed: "1:21",
      duration: "3:24",
      ratingLabel: "Your rating",
      rating: {
        src: "/home/rating-segments.svg",
        alt: "Rated 4 out of 5",
      },
      feedback:
        "Great vocal texture and the hook lands at 0:45. The kick feels buried under the bass, try a cleaner low end before pitching.",
      feedbackCount: "128 / 80 characters minimum",
      skip: "Skip track",
      submit: "Submit feedback",
    },
    /** Bar heights in px from the Figma mock; the first `played` bars are cyan. */
    waveform: [
      8, 31, 47, 40, 33, 22, 10, 14, 18, 20, 25, 20, 18, 39, 53, 45, 34, 17, 23,
      34, 34, 18, 13, 14, 16, 30, 41, 33, 22, 23, 36, 49, 48, 29, 15, 22, 17,
      14, 18, 15, 11, 29, 37, 48, 46, 23, 17, 38, 38, 36, 27, 11, 12, 18, 21,
      30, 30, 10, 28, 48, 48, 44, 30, 11, 26, 31, 19, 13,
    ],
    played: 27,
  },

  community: {
    badge: "06",
    title: "Find your next collab",
    text: "Producers looking for a topline, singers looking for a beat, rappers looking for a feature. Chat with 12 000 independent artists filtered by genre, city and skills.",
    avatars: [
      { initials: "NV", tone: "cyan" },
      { initials: "KO", tone: "rose" },
      { initials: "LM", tone: "slate" },
      { initials: "JB", tone: "cyan" },
      { initials: "AS", tone: "rose" },
    ] satisfies { initials: string; tone: AvatarTone }[],
    online: "+12k artists online this week",
    cta: { label: "Join the community", href: "/signup" },
    chat: {
      initials: "KO",
      tone: "rose" as AvatarTone,
      name: "Kofi Osei",
      role: "Producer · Afrobeats, R&B · Lyon",
      onlineDot: "/home/online-dot.svg",
      onlineLabel: "Online",
      first:
        "Loved your track in the anonymous queue! I'm working on a beat that would fit your voice.",
      track: {
        cover: "/home/track-cover.jpg",
        title: "Midnight Drive (beat)",
        meta: "Kofi Osei · 104 BPM · 2:58",
      },
      reply:
        "Just listened, it's exactly my vibe. Let's do a session next week?",
      placeholder: "Write a message…",
      send: "Send",
    },
  },

  testimonialsHead: {
    id: "stories",
    quoteMark: "/home/quote-big.svg",
    title: "Artists who got heard",
  },
  testimonials: [
    {
      result: "+4 100 monthly listeners",
      quote:
        "“Three Spotify playlists said yes in my first week. The feedback from the rate queue fixed my mix before I even pitched.”",
      initials: "NV",
      tone: "cyan",
      name: "Nina Vega",
      role: "Singer-songwriter · Indie pop",
    },
    {
      result: "Signed with Nightshift Records",
      quote:
        "“I signed my first EP with an independent label I found in the catalogue. Their A&R answered in four days.”",
      initials: "JB",
      tone: "rose",
      name: "Jay Bamba",
      role: "Rapper · Drill / Hip-hop",
    },
    {
      result: "Played on 2 radios",
      quote:
        "“Radio play on two web radios and a blog interview. Credits are cheap compared with any PR agency.”",
      initials: "LM",
      tone: "slate",
      name: "Léa Martin",
      role: "Producer · Electro / House",
    },
  ] satisfies {
    result: string;
    quote: string;
    initials: string;
    tone: AvatarTone;
    name: string;
    role: string;
  }[],

  final: {
    title: ["Your next fans", "are listening"],
    text: "Create your artist profile in 2 minutes. Upload your first track and get 2 bonus credits.",
    photo: "/brand/hero-bg.jpg",
    dots: "/brand/dots.png",
    primary: { label: "Start pitching for free", href: "/signup" },
    secondary: { label: "See credit packs", href: "/pricing" },
  },
};
