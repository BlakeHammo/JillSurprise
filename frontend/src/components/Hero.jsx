import FloatingClouds from './FloatingClouds';

/* Tiny inline sakura SVG used as a decorative accent */
function SakuraPetal({ className, style }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse cx="20" cy="10" rx="8" ry="12" fill="#FFB6C1" opacity="0.8" transform="rotate(0  20 20)" />
      <ellipse cx="20" cy="10" rx="8" ry="12" fill="#FFB6C1" opacity="0.8" transform="rotate(72  20 20)" />
      <ellipse cx="20" cy="10" rx="8" ry="12" fill="#FFD6DC" opacity="0.7" transform="rotate(144 20 20)" />
      <ellipse cx="20" cy="10" rx="8" ry="12" fill="#FFB6C1" opacity="0.8" transform="rotate(216 20 20)" />
      <ellipse cx="20" cy="10" rx="8" ry="12" fill="#FFD6DC" opacity="0.7" transform="rotate(288 20 20)" />
      <circle cx="20" cy="20" r="4" fill="#FFCDD2" />
    </svg>
  );
}

export default function Hero() {
  return (
    <section className="hero-bg relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 pb-16">
      {/* Animated clouds layer */}
      <FloatingClouds />

      {/* Floating sakura accents */}
      <SakuraPetal
        className="absolute top-24 left-10 w-10 opacity-70 animate-float"
        style={{ animationDelay: '0s' }}
      />
      <SakuraPetal
        className="absolute top-32 right-16 w-7 opacity-60 animate-float-slow"
        style={{ animationDelay: '2s' }}
      />
      <SakuraPetal
        className="absolute bottom-40 left-1/4 w-8 opacity-50 animate-float-slower"
        style={{ animationDelay: '4s' }}
      />
      <SakuraPetal
        className="absolute bottom-28 right-1/3 w-6 opacity-55 animate-float"
        style={{ animationDelay: '1.5s' }}
      />
      <SakuraPetal
        className="absolute top-1/2 left-8 w-5 opacity-40 animate-float-slow"
        style={{ animationDelay: '3s' }}
      />

      {/* Hero card */}
      <div className="relative z-10 text-center max-w-2xl animate-fade-in-up">
        {/* Emoji badge */}
        <div className="inline-block mb-4 animate-float text-5xl" style={{ animationDelay: '0.2s' }}>
          🌸
        </div>

        {/* Main title */}
        <h1
          className="font-dancing text-6xl sm:text-7xl md:text-8xl font-bold mb-4 leading-tight"
          style={{ color: '#4A4A6A', textShadow: '0 2px 12px rgba(135,206,235,0.35)' }}
        >
          Okinawa Diaries
        </h1>

        {/* Decorative line */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-pink-300 rounded-full" />
          <span className="text-2xl animate-float-slow" style={{ animationDelay: '1s' }}>🌺</span>
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-pink-300 rounded-full" />
        </div>

        {/* Subtitle */}
        <p className="font-nunito text-xl sm:text-2xl font-medium text-cinna-text/80 mb-8 leading-relaxed">
          A little window into your adventure ✨
        </p>

        {/* Soft info bubble */}
        <div className="glass-card inline-block px-6 py-3 text-cinna-text-soft font-nunito text-sm font-semibold tracking-wide">
          📍 Okinawa, Japan &nbsp;·&nbsp; 🗓️ February 2026
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-fade-in"
        style={{ animationDelay: '1.2s' }}>
        <span className="font-nunito text-cinna-text-soft text-xs font-semibold tracking-widest uppercase">scroll</span>
        <div className="w-5 h-8 rounded-full border-2 border-cinna-sky/60 flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-cinna-sky rounded-full animate-bounce" />
        </div>
      </div>

      {/* Bottom wave divider */}
      <div className="wave-divider absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ height: 80 }}>
          <path
            d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
            fill="rgba(255,255,255,0.6)"
          />
          <path
            d="M0,55 C360,20 720,80 1080,45 C1260,30 1380,65 1440,60 L1440,80 L0,80 Z"
            fill="rgba(255,255,255,0.9)"
          />
        </svg>
      </div>
    </section>
  );
}
