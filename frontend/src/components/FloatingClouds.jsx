/*
 * FloatingClouds — uses cloud.png scattered at varying sizes/opacities
 * to form a soft atmospheric backdrop across the hero section.
 */
export default function FloatingClouds() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none" aria-hidden="true">
      {/* Large — top left, drifting in from edge */}
      <img src="/cloud.png" alt=""
        className="absolute -left-8 top-4 w-56 opacity-60 animate-cloud-drift"
        style={{ animationDelay: '0s' }}
      />
      {/* Large — top right */}
      <img src="/cloud.png" alt=""
        className="absolute -right-6 top-10 w-48 opacity-55 animate-cloud-drift-r"
        style={{ animationDelay: '3s' }}
      />
      {/* Medium — upper centre */}
      <img src="/cloud.png" alt=""
        className="absolute left-[36%] top-2 w-36 opacity-40 animate-cloud-drift"
        style={{ animationDelay: '6s' }}
      />
      {/* Medium — mid right */}
      <img src="/cloud.png" alt=""
        className="absolute right-[18%] top-[32%] w-40 opacity-30 animate-cloud-drift-r"
        style={{ animationDelay: '9s' }}
      />
      {/* Small — mid left */}
      <img src="/cloud.png" alt=""
        className="absolute left-[8%] top-[40%] w-28 opacity-25 animate-cloud-drift"
        style={{ animationDelay: '5s' }}
      />
      {/* Small — bottom right */}
      <img src="/cloud.png" alt=""
        className="absolute right-[28%] bottom-16 w-32 opacity-30 animate-cloud-drift-r"
        style={{ animationDelay: '2s' }}
      />
      {/* Tiny — bottom left */}
      <img src="/cloud.png" alt=""
        className="absolute left-8 bottom-12 w-20 opacity-35 animate-cloud-drift"
        style={{ animationDelay: '8s' }}
      />
      {/* Tiny — top centre-right, barely visible */}
      <img src="/cloud.png" alt=""
        className="absolute left-[54%] top-6 w-24 opacity-20 animate-cloud-drift"
        style={{ animationDelay: '4s' }}
      />
    </div>
  );
}
