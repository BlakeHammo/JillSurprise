/**
 * CinnaEars — Cinnamoroll's iconic floppy ear silhouettes.
 * Positioned absolutely; place the parent with `relative` and enough top padding.
 */
export default function CinnaEars({ className }) {
  return (
    <div
      className={`absolute -top-12 left-0 right-0 flex justify-between px-6 pointer-events-none select-none ${className || ''}`}
    >
      {/* Left ear — tilts left */}
      <svg width="64" height="76" viewBox="0 0 64 76" aria-hidden="true">
        <ellipse
          cx="32" cy="44" rx="28" ry="40"
          fill="#C8B4E3" opacity="0.75"
          transform="rotate(-22 32 44)"
        />
        <ellipse
          cx="32" cy="44" rx="18" ry="28"
          fill="#E8D5F5" opacity="0.65"
          transform="rotate(-22 32 44)"
        />
      </svg>

      {/* Right ear — tilts right */}
      <svg width="64" height="76" viewBox="0 0 64 76" aria-hidden="true">
        <ellipse
          cx="32" cy="44" rx="28" ry="40"
          fill="#C8B4E3" opacity="0.75"
          transform="rotate(22 32 44)"
        />
        <ellipse
          cx="32" cy="44" rx="18" ry="28"
          fill="#E8D5F5" opacity="0.65"
          transform="rotate(22 32 44)"
        />
      </svg>
    </div>
  );
}
