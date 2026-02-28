/**
 * SparkleAccent — a 4-pointed kawaii sparkle star used as a decorative accent.
 * Props: className, style, color (default: '#FFE566')
 */
export default function SparkleAccent({ className, style, color = '#FFE566' }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Large 4-pointed star */}
      <path
        d="M12 2 L13.2 10.8 L22 12 L13.2 13.2 L12 22 L10.8 13.2 L2 12 L10.8 10.8 Z"
        fill={color}
        opacity="0.95"
      />
      {/* Small centre dot */}
      <circle cx="12" cy="12" r="1.5" fill="white" opacity="0.7" />
    </svg>
  );
}
