import Hibiscus from './Hibiscus';

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

export default function AboutSection() {
  return (
    <>
      <WaveDivider />

      <section
        id="about"
        className="relative py-24 px-4 overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #e8d5f5 0%, #f5eaff 35%, #fff0f5 65%, #fff8f0 100%)',
        }}
      >
        {/* Subtle floating hibiscus accents */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-10 left-10 animate-float-rotate" style={{ animationDelay: '0s' }}>
            <Hibiscus className="w-10 h-10 opacity-30" />
          </div>
          <div className="absolute top-16 right-14 animate-float-rotate" style={{ animationDelay: '2.5s' }}>
            <Hibiscus className="w-8 h-8 opacity-25" />
          </div>
          <div className="absolute bottom-16 left-1/4 animate-sway" style={{ animationDelay: '4s' }}>
            <Hibiscus className="w-7 h-7 opacity-25" />
          </div>
        </div>

        {/* Cinnamoroll peeking in from the right */}
        <img
          src="/cinna1.png"
          alt=""
          aria-hidden="true"
          draggable={false}
          className="absolute bottom-0 right-0 w-40 sm:w-52 md:w-60 select-none opacity-80 animate-float-slow"
          style={{
            animationDelay: '1s',
            filter: 'drop-shadow(0 8px 20px rgba(200,180,227,0.4))',
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto text-center animate-fade-in-up">

          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/70 shadow-glow mb-6 text-4xl animate-float">
            🌺
          </div>

          {/* Title */}
          <h2
            className="font-dancing text-5xl font-bold text-cinna-text mb-6"
            style={{ textShadow: '0 2px 12px rgba(200,180,227,0.35)' }}
          >
            A little note for you
          </h2>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="h-px w-16 bg-cinna-lavender/50 rounded-full" />
            <span className="text-xl">🌺</span>
            <span className="h-px w-16 bg-cinna-lavender/50 rounded-full" />
          </div>

          {/* Message */}
          <div className="glass-card px-8 py-8 text-left relative overflow-hidden">
            {/* Hibiscus watermark */}
            <div className="absolute -bottom-4 -right-4 pointer-events-none" aria-hidden="true">
              <Hibiscus className="w-32 h-32 opacity-[0.07]" />
            </div>

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
            Made with lots of love · Okinawa Diaries 🌺
          </p>
        </div>
      </section>
    </>
  );
}
