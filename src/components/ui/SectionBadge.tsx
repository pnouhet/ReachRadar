/** Figma Section Badge (4409:52): white parallelogram, midnight bold italic number. */
export function SectionBadge({ children }: { children: string }) {
  return (
    <span className="slant inline-flex h-12 items-center px-[18px] font-body text-[30px] font-bold italic text-midnight [--slant-bg:#fff] [--slant-border:#fff]">
      {children}
    </span>
  );
}
