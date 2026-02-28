import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '../utils/api';
import LocationPicker from './LocationPicker';
import EditEntryForm from './EditEntryForm';

const CATEGORIES = ['food', 'scenery', 'moments'];

const BADGE = {
  food:    { cls: 'badge-food',     label: '🍜 Food'    },
  scenery: { cls: 'badge-scenery',  label: '🏔️ Scenery' },
  moments: { cls: 'badge-moments',  label: '💫 Moments' },
};

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ── Upload Form ───────────────────────────────────────────────────────────────
function UploadForm({ password, onCreated }) {
  const [file, setFile]             = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [caption, setCaption]       = useState('');
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude]     = useState('');
  const [longitude, setLongitude]   = useState('');
  const [category, setCategory]     = useState('moments');
  const [date, setDate]             = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  const applyFile = (f) => {
    if (!f) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(f);
    setPreviewUrl(f.type.startsWith('image/') ? URL.createObjectURL(f) : null);
  };

  const handleDragOver  = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) applyFile(f);
  };

  const reset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null); setPreviewUrl(null);
    setCaption(''); setLocationName('');
    setLatitude(''); setLongitude('');
    setCategory('moments');
    setDate(new Date().toISOString().split('T')[0]);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // LocationPicker callback
  const handleLocationChange = useCallback((lat, lng, displayName) => {
    setLatitude(String(lat));
    setLongitude(String(lng));
    if (displayName && !locationName) {
      setLocationName(displayName.split(',')[0].trim());
    }
  }, [locationName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setError('Please choose a photo or video.'); return; }
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('caption', caption);
      formData.append('location_name', locationName);
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
      formData.append('category', category);
      formData.append('date', date);

      const result = await api.createEntry(formData, password);
      if (result.error) { setError(result.error); return; }

      setSuccess(true);
      onCreated(result);
      reset();
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-soft p-6 flex flex-col gap-4">
      <h2 className="font-nunito font-bold text-lg text-cinna-text">Add New Entry</h2>

      {/* Drop zone */}
      <div
        className={`drop-zone flex flex-col items-center justify-center gap-3 min-h-[140px] ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="max-h-36 max-w-full rounded-xl object-cover" />
        ) : file ? (
          <div className="text-center">
            <div className="text-4xl mb-1">🎬</div>
            <p className="font-nunito text-cinna-text-soft text-sm font-semibold">{file.name}</p>
          </div>
        ) : (
          <div className="text-center pointer-events-none select-none">
            <div className="text-4xl mb-2">📸</div>
            <p className="font-nunito text-cinna-text-soft font-semibold text-sm">Drag & drop a photo or video</p>
            <p className="font-nunito text-cinna-text-soft/60 text-xs mt-1">or click to browse</p>
          </div>
        )}
      </div>
      <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden"
        onChange={(e) => applyFile(e.target.files[0])} />

      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Caption — describe the moment…"
        rows={3}
        className="admin-input resize-none"
      />

      <input type="text" value={locationName}
        onChange={(e) => setLocationName(e.target.value)}
        placeholder="Location name (auto-filled when you pick on the map)"
        className="admin-input"
      />

      {/* Location picker — replaces raw lat/lng inputs */}
      <LocationPicker latitude={latitude} longitude={longitude} onLocationChange={handleLocationChange} />

      <div className="grid grid-cols-2 gap-3">
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="admin-input">
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="admin-input" />
      </div>

      {error   && <p className="font-nunito text-red-400 text-sm bg-red-50 rounded-xl px-3 py-2">{error}</p>}
      {success && <p className="font-nunito text-green-600 text-sm bg-green-50 rounded-xl px-3 py-2">🌸 Entry added!</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={loading}
          className="flex-1 py-2.5 rounded-full bg-cinna-sky text-white font-nunito font-bold text-sm shadow-soft hover:bg-cinna-sky/90 transition-all disabled:opacity-50">
          {loading ? 'Uploading…' : 'Add Entry ✨'}
        </button>
        {(file || caption) && (
          <button type="button" onClick={reset}
            className="px-4 py-2.5 rounded-full border border-gray-200 text-cinna-text-soft font-nunito font-semibold text-sm hover:bg-gray-50 transition-all">
            Reset
          </button>
        )}
      </div>
    </form>
  );
}

// ── Entries List ──────────────────────────────────────────────────────────────
function EntriesList({ entries, password, onUpdated, onDeleted }) {
  const [editingId, setEditingId]   = useState(null);
  const [confirmId, setConfirmId]   = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const timerRef = useRef(null);

  const handleDelete = async (id) => {
    if (confirmId === id) {
      clearTimeout(timerRef.current);
      setDeletingId(id);
      try {
        await api.deleteEntry(id, password);
        onDeleted(id);
      } catch {
        alert('Delete failed — please try again.');
      } finally {
        setDeletingId(null);
        setConfirmId(null);
      }
    } else {
      // If something else was pending confirmation, reset it
      if (editingId && editingId !== id) setEditingId(null);
      setConfirmId(id);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setConfirmId(null), 3000);
    }
  };

  const handleEdit = (id) => {
    setEditingId((prev) => (prev === id ? null : id));
    setConfirmId(null);
  };

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-soft p-8 text-center">
        <div className="text-4xl mb-3">🌺</div>
        <p className="font-nunito text-cinna-text-soft font-semibold">No entries yet.</p>
        <p className="font-nunito text-cinna-text-soft/60 text-sm mt-1">Use the form to add the first one!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-soft overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="font-nunito font-bold text-lg text-cinna-text">
          All Entries
          <span className="ml-2 text-sm font-normal text-cinna-text-soft">({entries.length})</span>
        </h2>
      </div>

      <ul className="divide-y divide-gray-50">
        {entries.map((entry) => (
          <li key={entry.id}>
            {/* Entry row */}
            <div className={[
              'flex items-center gap-3 px-4 py-3 transition-colors',
              editingId === entry.id ? 'bg-cinna-sky-pale/40' : 'hover:bg-gray-50/60',
            ].join(' ')}>

              {/* Thumbnail */}
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-cinna-sky-pale flex-shrink-0">
                {entry.media_type === 'photo' ? (
                  <img src={api.mediaUrl(entry.filename)} alt={entry.location_name}
                    className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl">🎬</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold font-nunito ${BADGE[entry.category]?.cls || ''}`}>
                    {BADGE[entry.category]?.label || entry.category}
                  </span>
                  <span className="font-nunito font-semibold text-cinna-text text-sm truncate">
                    {entry.location_name || 'Untitled'}
                  </span>
                </div>
                {entry.caption && (
                  <p className="font-nunito text-cinna-text-soft text-xs mt-0.5 truncate">{entry.caption}</p>
                )}
                <p className="font-nunito text-cinna-text-soft/60 text-xs mt-0.5">{formatDate(entry.date)}</p>
              </div>

              {/* Action buttons */}
              <div className="flex-shrink-0 flex gap-1.5">
                <button
                  onClick={() => handleEdit(entry.id)}
                  className={[
                    'px-3 py-1.5 rounded-full font-nunito font-bold text-xs transition-all',
                    editingId === entry.id
                      ? 'bg-cinna-sky text-white'
                      : 'bg-cinna-sky-pale text-cinna-sky hover:bg-cinna-sky-light',
                  ].join(' ')}
                >
                  {editingId === entry.id ? 'Close' : 'Edit'}
                </button>

                <button
                  onClick={() => handleDelete(entry.id)}
                  disabled={deletingId === entry.id}
                  className={[
                    'px-3 py-1.5 rounded-full font-nunito font-bold text-xs transition-all',
                    confirmId === entry.id
                      ? 'bg-red-500 text-white scale-105 shadow-sm'
                      : 'bg-red-50 text-red-400 hover:bg-red-100',
                    deletingId === entry.id ? 'opacity-50' : '',
                  ].join(' ')}
                >
                  {deletingId === entry.id ? '…' : confirmId === entry.id ? 'Sure?' : 'Delete'}
                </button>
              </div>
            </div>

            {/* Inline edit form (accordion) */}
            {editingId === entry.id && (
              <div className="px-4 pb-4">
                <EditEntryForm
                  entry={entry}
                  password={password}
                  onSave={(updated) => {
                    onUpdated(updated);
                    setEditingId(null);
                  }}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Dashboard root ────────────────────────────────────────────────────────────
export default function AdminDashboard({ password, onLogout }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getEntries()
      .then(setEntries)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCreated = (entry) => setEntries((prev) => [entry, ...prev]);
  const handleUpdated = (updated) =>
    setEntries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  const handleDeleted = (id) => setEntries((prev) => prev.filter((e) => e.id !== id));

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #f0f8ff 0%, #fff8f0 100%)' }}>

      {/* Inline admin input styles — scoped globally so LocationPicker / EditEntryForm inherit them */}
      <style>{`
        .admin-input {
          width: 100%;
          padding: 0.625rem 1rem;
          border-radius: 0.875rem;
          border: 1.5px solid #d4ecfa;
          background: #f8fdff;
          font-family: 'Nunito', sans-serif;
          font-size: 0.875rem;
          color: #4a4a6a;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .admin-input::placeholder { color: #8080a4; opacity: 0.7; }
        .admin-input:focus { border-color: #87ceeb; box-shadow: 0 0 0 3px rgba(135,206,235,0.15); }
        select.admin-input { cursor: pointer; }
      `}</style>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b border-cinna-sky/20 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌸</span>
            <span className="font-dancing text-2xl font-bold text-cinna-text">Okinawa Diaries</span>
            <span className="font-nunito text-cinna-text-soft text-sm ml-1">· Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="font-nunito text-cinna-text-soft text-sm hover:text-cinna-text transition">
              View site ↗
            </a>
            <button onClick={onLogout}
              className="px-4 py-1.5 rounded-full border border-cinna-sky/30 font-nunito font-semibold text-sm text-cinna-text-soft hover:bg-gray-50 transition">
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="text-5xl animate-bounce">🌸</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <UploadForm password={password} onCreated={handleCreated} />
            <EntriesList
              entries={entries}
              password={password}
              onUpdated={handleUpdated}
              onDeleted={handleDeleted}
            />
          </div>
        )}
      </main>
    </div>
  );
}
