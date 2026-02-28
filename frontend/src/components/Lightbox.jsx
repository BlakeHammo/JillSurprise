import { useEffect, useCallback, useRef, useState } from 'react';
import { api } from '../utils/api';

const BADGE = {
  food:     { cls: 'badge-food',     label: '🍜 Food'     },
  scenery:  { cls: 'badge-scenery',  label: '🏔️ Scenery'  },
  moments:  { cls: 'badge-moments',  label: '💫 Moments'  },
};

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

const SWIPE_THRESHOLD = 50;

// Chevron SVG icons — cleaner than text glyphs
function ChevronLeft({ size = 5 }) {
  return (
    <svg viewBox="0 0 24 24" className={`w-${size} h-${size}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
function ChevronRight({ size = 5 }) {
  return (
    <svg viewBox="0 0 24 24" className={`w-${size} h-${size}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export default function Lightbox({ entry, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const badge = BADGE[entry?.category] || BADGE.moments;
  const touchStartX = useRef(null);

  // ── Inner media carousel ───────────────────────────────────────────────────
  const [mediaIndex, setMediaIndex] = useState(0);
  useEffect(() => { setMediaIndex(0); }, [entry?.id]);

  const mediaList = (entry?.media && entry.media.length > 0)
    ? entry.media
    : [{ filename: entry?.filename, media_type: entry?.media_type }];

  const currentMedia = mediaList[mediaIndex] || mediaList[0];
  const hasPrevMedia = mediaIndex > 0;
  const hasNextMedia = mediaIndex < mediaList.length - 1;
  const hasMultiMedia = mediaList.length > 1;

  const goPrevMedia = () => setMediaIndex(i => Math.max(0, i - 1));
  const goNextMedia = () => setMediaIndex(i => Math.min(mediaList.length - 1, i + 1));

  // ── Keyboard ───────────────────────────────────────────────────────────────
  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft')  { if (hasPrevMedia) goPrevMedia(); else if (hasPrev) onPrev(); }
    if (e.key === 'ArrowRight') { if (hasNextMedia) goNextMedia(); else if (hasNext) onNext(); }
  }, [onClose, onPrev, onNext, hasPrev, hasNext, hasPrevMedia, hasNextMedia]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  // ── Touch swipe: within photos first, then between entries ─────────────────
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (delta < -SWIPE_THRESHOLD) { if (hasNextMedia) goNextMedia(); else if (hasNext) onNext(); }
    if (delta >  SWIPE_THRESHOLD) { if (hasPrevMedia) goPrevMedia(); else if (hasPrev) onPrev(); }
  };

  if (!entry) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in"
      style={{ background: 'rgba(30, 25, 50, 0.78)', backdropFilter: 'blur(12px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-label="Media viewer"
    >

      {/* ── Entry-level arrows — in the backdrop, lg+ only ─────────────────────
          Visually distinct: glass pill shape, lavender hover, labelled "MEMORY",
          positioned outside the card so they never overlap photo controls.       */}
      {hasPrev && (
        <button
          onClick={onPrev}
          className="absolute left-4 xl:left-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-2 group z-10"
          aria-label="Previous memory"
        >
          <span className="
            w-11 h-11 rounded-2xl
            bg-white/10 hover:bg-cinna-lavender/70
            border border-white/20 hover:border-cinna-lavender/60
            flex items-center justify-center
            text-white/70 hover:text-white
            transition-all duration-200 group-hover:scale-105
          ">
            <ChevronLeft size={5} />
          </span>
          <span className="text-white/35 text-[9px] font-nunito font-bold tracking-widest uppercase group-hover:text-white/60 transition-colors">
            Memory
          </span>
        </button>
      )}
      {hasNext && (
        <button
          onClick={onNext}
          className="absolute right-4 xl:right-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-2 group z-10"
          aria-label="Next memory"
        >
          <span className="
            w-11 h-11 rounded-2xl
            bg-white/10 hover:bg-cinna-lavender/70
            border border-white/20 hover:border-cinna-lavender/60
            flex items-center justify-center
            text-white/70 hover:text-white
            transition-all duration-200 group-hover:scale-105
          ">
            <ChevronRight size={5} />
          </span>
          <span className="text-white/35 text-[9px] font-nunito font-bold tracking-widest uppercase group-hover:text-white/60 transition-colors">
            Memory
          </span>
        </button>
      )}

      {/* ── Card ──────────────────────────────────────────────────────────── */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-fade-in-up max-h-[94vh] flex flex-col">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/25 hover:bg-black/45 flex items-center justify-center transition-all duration-150 hover:scale-110 text-white"
          aria-label="Close"
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* ── Media area ──────────────────── */}
        <div className="relative bg-cinna-sky-pale overflow-hidden flex items-center pt-4 pb-4 justify-center min-h-[200px]">

          {currentMedia?.media_type === 'video' ? (
            <video
              key={`${entry.id}-${mediaIndex}`}
              src={api.mediaUrl(currentMedia.filename)}
              controls
              autoPlay
              className="lightbox-media"
            />
          ) : (
            <img
              key={`${entry.id}-${mediaIndex}`}
              src={api.mediaUrl(currentMedia?.filename)}
              alt={entry.caption || entry.location_name}
              className="lightbox-media"
            />
          )}

          {/* Photo counter chip — top-left overlay on the image */}
          {hasMultiMedia && (
            <span className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-white/70 text-cinna-text rounded-full px-2.5 py-1 text-xs font-nunito font-semibold backdrop-blur-sm shadow-soft">
              📷 {mediaIndex + 1} / {mediaList.length}
            </span>
          )}

          {/* ── Photo-level arrows — small, light, on the image ─────────────
              Style: circular, white/soft fill — clearly different from the
              glass entry arrows outside the card.                            */}
          {hasPrevMedia && (
            <button
              onClick={(e) => { e.stopPropagation(); goPrevMedia(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/70 hover:bg-white/90 shadow-soft flex items-center justify-center transition-all duration-150 hover:scale-110 text-cinna-text"
              aria-label="Previous photo"
            >
              <ChevronLeft size={4} />
            </button>
          )}
          {hasNextMedia && (
            <button
              onClick={(e) => { e.stopPropagation(); goNextMedia(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/70 hover:bg-white/90 shadow-soft flex items-center justify-center transition-all duration-150 hover:scale-110 text-cinna-text"
              aria-label="Next photo"
            >
              <ChevronRight size={4} />
            </button>
          )}
        </div>

        {/* ── Dot navigation strip (only for multi-photo collections) ─────── */}
        {hasMultiMedia && (
          <div className="flex items-center justify-center gap-1.5 py-2.5 bg-cinna-sky-pale border-t border-cinna-sky-light/40">
            {mediaList.map((_, i) => (
              <button
                key={i}
                onClick={() => setMediaIndex(i)}
                aria-label={`Photo ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  i === mediaIndex
                    ? 'w-5 bg-cinna-lavender'
                    : 'w-1.5 bg-cinna-lavender/30 hover:bg-cinna-lavender/55'
                }`}
              />
            ))}
          </div>
        )}

        {/* ── Details ─────────────────────────────────────────────────────── */}
        <div className="px-5 pt-4 pb-5 overflow-y-auto">

          {/* Top row: badge + location */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold font-nunito ${badge.cls}`}>
              {badge.label}
            </span>
            {entry.location_name && (
              <span className="font-nunito font-semibold text-cinna-text text-sm flex items-center gap-1 min-w-0">
                <span className="text-pink-400 shrink-0">📍</span>
                <span className="truncate">{entry.location_name}</span>
              </span>
            )}
          </div>

          {/* Caption */}
          {entry.caption && (
            <p className="font-nunito text-cinna-text leading-relaxed text-sm mb-3">
              {entry.caption}
            </p>
          )}

          {/* Date */}
          {entry.date && (
            <p className="font-nunito text-cinna-text-soft text-xs italic">
              ♡ {formatDate(entry.date)}
            </p>
          )}

          {/* ── Mobile entry navigation (< lg) ───────────────────────────────
              On small screens the backdrop arrows are hidden, so we show
              compact prev/next text buttons here. Clearly labelled "memory"
              so they're not confused with the photo arrows on the image.     */}
          {(hasPrev || hasNext) && (
            <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-gray-100 lg:hidden">
              <button
                onClick={onPrev}
                disabled={!hasPrev}
                className="flex items-center gap-1 text-xs font-nunito font-semibold text-cinna-text-soft hover:text-cinna-lavender disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={3} />
                Prev memory
              </button>
              <button
                onClick={onNext}
                disabled={!hasNext}
                className="flex items-center gap-1 text-xs font-nunito font-semibold text-cinna-text-soft hover:text-cinna-lavender disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
              >
                Next memory
                <ChevronRight size={3} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
