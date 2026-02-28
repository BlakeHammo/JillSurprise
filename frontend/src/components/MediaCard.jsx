import { api } from '../utils/api';

const BADGE = {
  food:     { cls: 'badge-food',     label: '🍜 Food'     },
  scenery:  { cls: 'badge-scenery',  label: '🏔️ Scenery'  },
  moments:  { cls: 'badge-moments',  label: '💫 Moments'  },
};

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export default function MediaCard({ entry, onClick, animationDelay = 0 }) {
  const badge = BADGE[entry.category] || BADGE.moments;
  const mediaUrl = api.mediaUrl(entry.filename);

  return (
    <article
      className="polaroid group animate-fade-in-up"
      style={{ animationDelay: `${animationDelay}s` }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={`View entry: ${entry.location_name}`}
    >
      {/* Media thumbnail */}
      <div className="relative overflow-hidden aspect-[4/3] bg-cinna-sky-pale">
        {entry.media_type === 'video' ? (
          <>
            <video
              src={mediaUrl}
              className="w-full h-full object-cover"
              preload="metadata"
              muted
              playsInline
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-soft">
                <svg className="w-6 h-6 ml-1 text-cinna-text" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </>
        ) : (
          <img
            src={mediaUrl}
            alt={entry.caption || entry.location_name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}

        {/* Category badge */}
        <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold font-nunito ${badge.cls}`}>
          {badge.label}
        </span>

        {/* Multi-photo count badge */}
        {entry.media?.length > 1 && (
          <span className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 text-white rounded-full px-2 py-0.5 text-xs font-nunito font-bold">
            📷 {entry.media.length}
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="px-4 pt-3 pb-4">
        {entry.location_name && (
          <p className="font-nunito font-bold text-cinna-text text-sm flex items-center gap-1 mb-1">
            <span className="text-pink-400">📍</span>
            {entry.location_name}
          </p>
        )}

        {entry.caption && (
          <p className="font-nunito text-cinna-text-soft text-xs leading-relaxed line-clamp-2">
            {entry.caption}
          </p>
        )}

        <p className="font-nunito text-cinna-text-soft/70 text-xs mt-2 italic">
          ♡ {formatDate(entry.date)}
        </p>
      </div>
    </article>
  );
}
