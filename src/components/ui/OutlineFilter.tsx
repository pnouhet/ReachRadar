/** SVG filter used by the `text-outline` utility: a clean 1.5px outline with no inner contour lines. */
export function OutlineFilter() {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" style={{ position: "absolute" }}>
      <filter id="text-outline" x="-5%" y="-10%" width="110%" height="120%" colorInterpolationFilters="sRGB">
        <feMorphology in="SourceAlpha" operator="dilate" radius="1.5" result="grown" />
        <feComposite in="grown" in2="SourceAlpha" operator="out" result="ring" />
        <feFlood floodColor="#fff" />
        <feComposite in2="ring" operator="in" />
      </filter>
    </svg>
  );
}
