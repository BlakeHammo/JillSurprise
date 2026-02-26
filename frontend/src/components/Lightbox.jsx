import { useEffect, useCallback } from 'react';
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

export default function Lightbox({ entry, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const badge = BADGE[entry?.category] || BADGE.moments;

  // Close on Escape / navigate with arrow keys
  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft' && hasPrev) onPrev();
    if (e.key === 'ArrowRight' && hasNext) onNext();
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  if (!entry) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(74, 74, 106, 0.55)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
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

        {/* Navigation arrows */}
        {hasPrev && (
          <button
            onClick={onPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 shadow-soft flex items-center justify-center hover:scale-110 transition-transform text-cinna-text"
            aria-label="Previous"
          >
            ‹
          </button>
        )}
        {hasNext && (
          <button
            onClick={onNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 shadow-soft flex items-center justify-center hover:scale-110 transition-transform text-cinna-text"
            aria-label="Next"
          >
            ›
          </button>
        )}

        {/* Media */}
        <div className="flex items-center justify-center bg-cinna-sky-pale overflow-hidden min-h-[220px]">
          {entry.media_type === 'video' ? (
            <video
              key={entry.id}
              src={api.mediaUrl(entry.filename)}
              controls
              autoPlay
              className="lightbox-media"
            />
          ) : (
            <img
              key={entry.id}
              src={api.mediaUrl(entry.filename)}
              alt={entry.caption || entry.location_name}
              className="lightbox-media"
            />
          )}
        </div>

        {/* Details */}
        <div className="px-6 py-5 overflow-y-auto">
          {/* Badge + location row */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold font-nunito ${badge.cls}`}>
              {badge.label}
            </span>
            {entry.location_name && (
              <span className="font-nunito font-semibold text-cinna-text text-sm flex items-center gap-1">
                <span className="text-cinna-pink">📍</span>
                {entry.location_name}
              </span>
            )}
            {entry.date && (
              <span className="ml-auto font-nunito text-cinna-text-soft text-xs italic">
                {formatDate(entry.date)}
              </span>
            )}
          </div>

          {/* Caption */}
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
