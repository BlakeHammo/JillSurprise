const FILTERS = [
  { key: 'all',      label: 'All',      emoji: '✨' },
  { key: 'food',     label: 'Food',     emoji: '🍜' },
  { key: 'scenery',  label: 'Scenery',  emoji: '🏔️' },
  { key: 'moments',  label: 'Moments',  emoji: '💫' },
];

export default function FilterBar({ active, onChange }) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-10" role="group" aria-label="Filter by category">
      {FILTERS.map((f) => {
        const isActive = active === f.key;
        return (
          <button
            key={f.key}
            onClick={() => onChange(f.key)}
            aria-pressed={isActive}
            className={[
              'flex items-center gap-2 px-5 py-2.5 rounded-full font-nunito font-semibold text-sm',
              'transition-all duration-200 select-none',
              isActive
                ? 'bg-cinna-sky text-white shadow-soft scale-105'
                : 'bg-white/80 text-cinna-text border border-cinna-sky/30 hover:bg-cinna-sky-light hover:scale-105',
            ].join(' ')}
          >
            <span>{f.emoji}</span>
            <span>{f.label}</span>
          </button>
        );
      })}
    </div>
  );
}
