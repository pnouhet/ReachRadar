export type PasswordStrength = 0 | 1 | 2 | 3 | 4;

/** One point each: ≥ 8 chars, ≥ 12 chars, mixed case, contains a digit or symbol. */
export function passwordStrength(pw: string): PasswordStrength {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/[\d\W_]/.test(pw)) score++;
  return score as PasswordStrength;
}

export const STRENGTH_LABEL: Record<PasswordStrength, string> = {
  0: "",
  1: "Weak",
  2: "Fair",
  3: "Good",
  4: "Strong",
};
