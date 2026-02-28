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

const SWIPE_THRESHOLD = 50; // px

export default function Lightbox({ entry, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const badge = BADGE[entry?.category] || BADGE.moments;
  const touchStartX = useRef(null);

  // ── Inner media carousel index ─────────────────────────────────────────────
  const [mediaIndex, setMediaIndex] = useState(0);

  // Reset to first photo whenever the entry changes
  useEffect(() => {
    setMediaIndex(0);
  }, [entry?.id]);

  // Build the ordered media list: primary file first, then entry_media extras
  const mediaList = (entry?.media && entry.media.length > 0)
    ? entry.media
    : [{ filename: entry?.filename, media_type: entry?.media_type }];

  const currentMedia = mediaList[mediaIndex] || mediaList[0];
  const hasPrevMedia = mediaIndex > 0;
  const hasNextMedia = mediaIndex < mediaList.length - 1;
  const hasMultiMedia = mediaList.length > 1;

  const goPrevMedia = () => setMediaIndex(i => Math.max(0, i - 1));
  const goNextMedia = () => setMediaIndex(i => Math.min(mediaList.length - 1, i + 1));

  // ── Keyboard navigation ────────────────────────────────────────────────────
  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') {
      if (hasPrevMedia) goPrevMedia();
      else if (hasPrev) { onPrev(); }
    }
    if (e.key === 'ArrowRight') {
      if (hasNextMedia) goNextMedia();
      else if (hasNext) { onNext(); }
    }
  }, [onClose, onPrev, onNext, hasPrev, hasNext, hasPrevMedia, hasNextMedia]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  // ── Touch swipe: navigate within photos first, then between entries ────────
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (delta < -SWIPE_THRESHOLD) {
      if (hasNextMedia) goNextMedia();
      else if (hasNext) onNext();
    }
    if (delta > SWIPE_THRESHOLD) {
      if (hasPrevMedia) goPrevMedia();
      else if (hasPrev) onPrev();
    }
  };

  if (!entry) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(74, 74, 106, 0.55)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-label="Media viewer"
    >
      <div className="relative bg-white rounded-4xl shadow-soft-lg max-w-3xl w-full overflow-hidden animate-fade-in-up max-h-[92vh] flex flex-col">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/90 shadow-soft flex items-center justify-center hover:scale-110 transition-transform text-cinna-text-soft hover:text-cinna-text"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Entry-level navigation arrows (desktop) — reset mediaIndex on use */}
        {hasPrev && (
          <button
            onClick={() => { onPrev(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 shadow-soft hidden sm:flex items-center justify-center hover:scale-110 transition-transform text-cinna-text text-xl font-bold"
            aria-label="Previous memory"
          >
            ‹
          </button>
        )}
        {hasNext && (
          <button
            onClick={() => { onNext(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 shadow-soft hidden sm:flex items-center justify-center hover:scale-110 transition-transform text-cinna-text text-xl font-bold"
            aria-label="Next memory"
          >
            ›
          </button>
        )}

        {/* Media area */}
        <div className="relative flex items-center justify-center bg-cinna-sky-pale overflow-hidden min-h-[220px]">
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

          {/* Inner prev/next arrows (only shown when multiple photos) */}
          {hasPrevMedia && (
            <button
              onClick={(e) => { e.stopPropagation(); goPrevMedia(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/80 shadow flex items-center justify-center hover:scale-110 transition-transform text-cinna-text font-bold text-lg"
              aria-label="Previous photo"
            >
              ‹
            </button>
          )}
          {hasNextMedia && (
            <button
              onClick={(e) => { e.stopPropagation(); goNextMedia(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/80 shadow flex items-center justify-center hover:scale-110 transition-transform text-cinna-text font-bold text-lg"
              aria-label="Next photo"
            >
              ›
            </button>
          )}
        </div>

        {/* Dot navigation (only when multiple photos in this entry) */}
        {hasMultiMedia && (
          <div className="flex items-center justify-center gap-1.5 pt-3 pb-1">
            {mediaList.map((_, i) => (
              <button
                key={i}
                onClick={() => setMediaIndex(i)}
                aria-label={`Photo ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-200 ${
                  i === mediaIndex
                    ? 'w-5 bg-cinna-lavender'
                    : 'w-2 bg-cinna-lavender/30 hover:bg-cinna-lavender/60'
                }`}
              />
            ))}
          </div>
        )}

        {/* Details */}
        <div className="px-6 py-5 overflow-y-auto">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold font-nunito ${badge.cls}`}>
              {badge.label}
            </span>
            {entry.location_name && (
              <span className="font-nunito font-semibold text-cinna-text text-sm flex items-center gap-1">
                <span className="text-pink-400">📍</span>
                {entry.location_name}
              </span>
            )}
            {hasMultiMedia && (
              <span className="font-nunito text-cinna-text-soft text-xs flex items-center gap-1">
                📷 {mediaIndex + 1} / {mediaList.length}
              </span>
            )}
            {entry.date && (
              <span className="ml-auto font-nunito text-cinna-text-soft text-xs italic">
                {formatDate(entry.date)}
              </span>
            )}
          </div>

          {entry.caption && (
            <p className="font-nunito text-cinna-text leading-relaxed text-sm">
              {entry.caption}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
