/* ── Decorative wave divider at the top of the about section ─────────────── */
function WaveDivider() {
  return (
    <div className="wave-divider -mb-1">
      <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ height: 80 }}>
        <path
          d="M0,40 C360,80 720,0 1080,45 C1260,65 1380,25 1440,50 L1440,0 L0,0 Z"
          fill="rgba(255,255,255,0.5)"
        />
      </svg>
    </div>
  );
}

/* ── Small sakura SVG ────────────────────────────────────────────────────── */
function Sakura({ size = 32, opacity = 0.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <ellipse
          key={i}
          cx="20" cy="10" rx="7" ry="11"
          fill={i % 2 === 0 ? '#FFB6C1' : '#FFD6DC'}
          transform={`rotate(${angle} 20 20)`}
          opacity="0.85"
        />
      ))}
      <circle cx="20" cy="20" r="4" fill="#FFCDD2" />
    </svg>
  );
}

export default function AboutSection() {
  return (
    <>
      <WaveDivider />

      <section
        id="about"
        className="relative py-24 px-4 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #E8D5F5 0%, #FFD6DC 40%, #B8E0F7 100%)',
        }}
      >
        {/* Background decorative petals */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-8  left-8  animate-float"       style={{ animationDelay: '0s' }}>  <Sakura size={48} opacity={0.4} /></div>
          <div className="absolute top-12 right-12 animate-float-slow" style={{ animationDelay: '2s' }}>  <Sakura size={36} opacity={0.35} /></div>
          <div className="absolute bottom-8 left-1/4 animate-float-slower" style={{ animationDelay: '4s' }}><Sakura size={28} opacity={0.3} /></div>
          <div className="absolute bottom-12 right-1/4 animate-float" style={{ animationDelay: '1s' }}>   <Sakura size={44} opacity={0.38} /></div>
          <div className="absolute top-1/2 left-4 animate-float-slow" style={{ animationDelay: '3s' }}>   <Sakura size={22} opacity={0.25} /></div>
          <div className="absolute top-1/3 right-4 animate-float"    style={{ animationDelay: '5s' }}>   <Sakura size={30} opacity={0.32} /></div>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto text-center animate-fade-in-up">

          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/70 shadow-glow mb-6 text-4xl animate-float">
            🌸
          </div>

          {/* Title */}
          <h2 className="font-dancing text-5xl font-bold text-cinna-text mb-6">
            A little note for you
          </h2>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="h-px w-12 bg-white/60 rounded-full" />
            <Sakura size={20} opacity={0.7} />
            <span className="h-px w-12 bg-white/60 rounded-full" />
          </div>

          {/* Message — edit this to something personal! */}
          <div className="glass-card px-8 py-8 text-left">
            <p className="font-nunito text-cinna-text text-lg leading-relaxed mb-4">
              She set off on the adventure of her lifetime, and I made this little corner of the internet just to hold her memories.
            </p>
            <p className="font-nunito text-cinna-text text-lg leading-relaxed mb-4">
              Every photo here is a moment I can't stop smiling about, even from thousands of miles away.
            </p>
            <p className="font-nunito text-cinna-text text-lg leading-relaxed font-semibold">
              Jill, this one's for you. I hope Okinawa is as magical as you deserve. 🌺
            </p>

            {/* Signature */}
            <p className="font-dancing text-3xl text-cinna-lavender mt-6 text-right">
              with love 💕
            </p>
          </div>

          {/* Bottom info */}
          <p className="font-nunito text-cinna-text-soft text-sm mt-8">
            Made with lots of love · Okinawa Diaries 🌸
          </p>
        </div>
      </section>
    </>
  );
}
