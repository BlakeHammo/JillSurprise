/**
 * Hibiscus — 5-petal hibiscus SVG, Okinawa's emblematic flower.
 * Props: className, style
 */
export default function Hibiscus({ className, style }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="-8 -8 76 76"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {[0, 72, 144, 216, 288].map((r) => (
        <ellipse
          key={r}
          cx="30" cy="12" rx="9" ry="16"
          fill="#E8365D" opacity="0.85"
          transform={`rotate(${r} 30 30)`}
        />
      ))}
      {/* Inner petal highlight */}
      {[0, 72, 144, 216, 288].map((r) => (
        <ellipse
          key={`h${r}`}
          cx="30" cy="16" rx="4" ry="8"
          fill="#FF6B8A" opacity="0.5"
          transform={`rotate(${r} 30 30)`}
        />
      ))}
      {/* Stamen */}
      <circle cx="30" cy="30" r="6" fill="#FFE566" />
      <circle cx="30" cy="30" r="3.5" fill="#FF6B8A" />
      <circle cx="30" cy="30" r="1.5" fill="#fff" opacity="0.8" />
    </svg>
  );
}
