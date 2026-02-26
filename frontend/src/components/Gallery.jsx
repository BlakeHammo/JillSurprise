import { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import { api } from '../utils/api';
import FilterBar from './FilterBar';
import MediaCard from './MediaCard';
import Lightbox from './Lightbox';

const BREAKPOINTS = { default: 3, 1100: 2, 700: 1 };

export default function Gallery() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    api.getEntries()
      .then(setEntries)
      .catch(() => setError('Could not load entries — is the backend running?'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? entries : entries.filter((e) => e.category === filter);

  const openLightbox = (idx) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  const goPrev = () => setLightboxIndex((i) => Math.max(0, i - 1));
  const goNext = () => setLightboxIndex((i) => Math.min(filtered.length - 1, i + 1));

  return (
    <section id="gallery" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Section heading */}
        <div className="text-center mb-10 animate-fade-in-up">
          <h2 className="font-dancing text-5xl font-bold text-cinna-text mb-2">
            Memories 🌺
          </h2>
          <p className="font-nunito text-cinna-text-soft text-base">
            Every moment, captured in a little polaroid frame
          </p>
        </div>

        {/* Filter bar */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <FilterBar active={filter} onChange={setFilter} />
        </div>

        {/* States */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="text-5xl animate-bounce">🌸</div>
            <p className="font-nunito text-cinna-text-soft font-semibold">Loading memories…</p>
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🌧️</div>
            <p className="font-nunito text-cinna-text-soft">{error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🌺</div>
            <p className="font-nunito text-cinna-text-soft font-semibold text-lg">
              No memories here yet…
            </p>
            <p className="font-nunito text-cinna-text-soft text-sm mt-1">Check back soon! ✨</p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <Masonry
            breakpointCols={BREAKPOINTS}
            className="masonry-grid"
            columnClassName="masonry-grid-col"
          >
            {filtered.map((entry, idx) => (
              <MediaCard
                key={entry.id}
                entry={entry}
                onClick={() => openLightbox(idx)}
                animationDelay={idx * 0.07}
              />
            ))}
          </Masonry>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          entry={filtered[lightboxIndex]}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
          hasPrev={lightboxIndex > 0}
          hasNext={lightboxIndex < filtered.length - 1}
        />
      )}
    </section>
  );
}
