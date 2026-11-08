/** Genre list: genre-agnostic, electronic-first ordering (DESIGN.md §11b). */
export const GENRES = [
  "House",
  "Deep house",
  "Melodic techno",
  "Techno",
  "Afro house",
  "Progressive house",
  "Drum & bass",
  "Downtempo",
  "Ambient",
  "Electronica",
  "Pop",
  "Hip-hop",
  "R&B",
  "Rock",
  "Indie",
  "Jazz",
  "Classical",
  "Latin",
  "Reggae",
  "Metal",
  "Folk",
  "Other",
] as const;

export type Genre = (typeof GENRES)[number];

/** Genres shown before "+ More genres" in pickers (16a). */
export const FEATURED_GENRES: readonly Genre[] = GENRES.slice(0, 8);
