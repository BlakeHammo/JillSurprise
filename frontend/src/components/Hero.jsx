import FloatingClouds from './FloatingClouds';
import Hibiscus from './Hibiscus';
import SparkleAccent from './SparkleAccent';

export default function Hero() {
  return (
    <section className="hero-bg relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 pb-24">

      {/* Cloud backdrop — soft and atmospheric */}
      <FloatingClouds />

      {/* Scattered hibiscus — Okinawa accent */}
      <Hibiscus
        className="absolute top-20 right-14 w-9 opacity-55 animate-float-rotate"
        style={{ animationDelay: '0.5s' }}
      />
      <Hibiscus
        className="absolute top-1/3 left-10 w-7 opacity-40 animate-sway"
        style={{ animationDelay: '2s' }}
      />
      <Hibiscus
        className="absolute bottom-36 right-1/4 w-8 opacity-45 animate-float-rotate"
        style={{ animationDelay: '3.5s' }}
      />

      {/* Sparkles */}
      <SparkleAccent
        className="absolute top-14 right-8 w-5 opacity-70 animate-sparkle"
        style={{ animationDelay: '0s' }}
        color="#FFE566"
      />
      <SparkleAccent
        className="absolute top-28 left-16 w-4 opacity-50 animate-sparkle"
        style={{ animationDelay: '1.1s' }}
        color="#C8B4E3"
      />

      {/* ── Large Cinnamoroll characters — sit below the content in the sky ── */}
      <img
        src="/cinna1.png"
        alt=""
        aria-hidden="true"
        draggable={false}
        className="absolute bottom-14 left-0 w-52 sm:w-64 md:w-72 select-none animate-float-slow"
        style={{
          animationDelay: '0.8s',
          filter: 'drop-shadow(0 10px 24px rgba(200,180,227,0.45))',
        }}
      />
      <img
        src="/cinna2.png"
        alt=""
        aria-hidden="true"
        draggable={false}
        className="absolute bottom-14 right-0 w-44 sm:w-56 md:w-64 select-none animate-float"
        style={{
          animationDelay: '2.2s',
          filter: 'drop-shadow(0 10px 24px rgba(200,180,227,0.4))',
        }}
      />

      {/* ── Hero content — floats above the characters ── */}
      <div className="relative z-10 text-center max-w-xl animate-fade-in-up">

        {/* Main title */}
        <h1
          className="font-dancing text-6xl sm:text-7xl md:text-8xl font-bold mb-4 leading-tight text-cinna-text"
          style={{ textShadow: '0 2px 16px rgba(200,180,227,0.4)' }}
        >
          Okinawa Diaries
        </h1>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="h-px w-16 bg-cinna-lavender/50 rounded-full" />
          <span className="text-xl">🌺</span>
          <span className="h-px w-16 bg-cinna-lavender/50 rounded-full" />
        </div>

        {/* Subtitle */}
        <p className="font-nunito text-xl sm:text-2xl font-medium text-cinna-text/75 mb-8 leading-relaxed">
          A little window into your adventure 
        </p>

        {/* Info bubble */}
        <div className="glass-card inline-block px-6 py-3 text-cinna-text-soft font-nunito text-sm font-semibold tracking-wide">
          📍 Okinawa, Japan &nbsp;·&nbsp; February 2026
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-fade-in z-10"
        style={{ animationDelay: '1.2s' }}
      >
        <span className="font-nunito text-cinna-text-soft text-xs font-semibold tracking-widest uppercase">scroll</span>
        <div className="w-5 h-8 rounded-full border-2 border-cinna-sky/60 flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-cinna-sky rounded-full animate-bounce" />
        </div>
      </div>

      {/* Bottom wave divider */}
      <div className="wave-divider absolute bottom-0 left-0 w-full z-10">
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
