import { z } from "zod";

export const ROLES = ["artist", "curator"] as const;
export const CURATOR_TYPES = ["playlist", "label", "radio", "blog"] as const;
export type CuratorType = (typeof CURATOR_TYPES)[number];

export const CURATOR_TYPE_LABEL: Record<CuratorType, string> = {
  playlist: "Spotify playlist",
  label: "Label",
  radio: "Radio",
  blog: "Blog / media",
};

const PASSWORD_RULE = "At least 8 characters with a number.";

export const passwordSchema = z
  .string()
  .min(8, PASSWORD_RULE)
  .regex(/\d/, PASSWORD_RULE);

const emailField = z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address."));

const playlistLink = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : undefined))
  .refine((v) => !v || !/spotify\.com\/user\//i.test(v), {
    message: "This is a profile link. Paste the link of one of your playlists.",
  })
  .transform((v) => (v && !/^https?:\/\//i.test(v) ? `https://${v}` : v))
  .refine((v) => !v || URL.canParse(v), { message: "Paste a full link to your playlist." });

export const signUpSchema = z.object({
  role: z.enum(ROLES),
  displayName: z.string().trim().min(2, "At least 2 characters.").max(60, "60 characters max."),
  email: emailField,
  password: passwordSchema,
  terms: z.literal("on", { error: "Please accept the terms to continue." }),
  curatorType: z.enum(CURATOR_TYPES).optional(),
  playlistLink,
});
export type SignUpInput = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Enter your password."),
});

export const emailSchema = z.object({ email: emailField });

export const newPasswordSchema = z
  .object({ password: passwordSchema, confirm: z.string() })
  .refine((v) => v.password === v.confirm, { message: "Passwords don't match.", path: ["confirm"] });
