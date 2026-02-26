/* Decorative floating cloud SVGs for the hero section */

function Cloud({ className, style }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 320 160"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g className="cloud-shape">
        <circle cx="85"  cy="100" r="55" />
        <circle cx="145" cy="75"  r="65" />
        <circle cx="215" cy="85"  r="55" />
        <circle cx="265" cy="105" r="42" />
        <rect x="45" y="105" width="240" height="55" rx="8" />
      </g>
    </svg>
  );
}

export default function FloatingClouds() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Large cloud — top left */}
      <Cloud
        className="absolute -left-16 top-8 w-80 opacity-70 animate-cloud-drift"
        style={{ animationDelay: '0s' }}
      />
      {/* Medium cloud — top right */}
      <Cloud
        className="absolute -right-8 top-16 w-64 opacity-60 animate-cloud-drift-r"
        style={{ animationDelay: '3s' }}
      />
      {/* Small cloud — centre left */}
      <Cloud
        className="absolute left-1/4 top-4 w-44 opacity-50 animate-cloud-drift"
        style={{ animationDelay: '6s' }}
      />
      {/* Medium cloud — bottom right */}
      <Cloud
        className="absolute right-1/4 bottom-12 w-56 opacity-40 animate-cloud-drift-r"
        style={{ animationDelay: '2s' }}
      />
      {/* Tiny cloud — bottom left */}
      <Cloud
        className="absolute left-8 bottom-8 w-36 opacity-45 animate-cloud-drift"
        style={{ animationDelay: '8s' }}
      />
    </div>
  );
}
