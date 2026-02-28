/**
 * EditEntryForm — inline accordion form for editing an existing entry's metadata.
 * The media file itself (filename / media_type) is never changed here.
 *
 * Props:
 *   entry    {object}   — the entry being edited (pre-fills all fields)
 *   password {string}   — admin bearer token
 *   onSave   (updated)  — called with the updated entry object from the API
 *   onCancel ()         — called when the user dismisses the form without saving
 */
import { useState, useCallback } from 'react';
import { api } from '../utils/api';
import LocationPicker from './LocationPicker';

const CATEGORIES = ['food', 'scenery', 'moments'];

export default function EditEntryForm({ entry, password, onSave, onCancel }) {
  const [caption,      setCaption]      = useState(entry.caption      || '');
  const [locationName, setLocationName] = useState(entry.location_name || '');
  const [latitude,     setLatitude]     = useState(entry.latitude  != null ? String(entry.latitude)  : '');
  const [longitude,    setLongitude]    = useState(entry.longitude != null ? String(entry.longitude) : '');
  const [category,     setCategory]     = useState(entry.category     || 'moments');
  const [date,         setDate]         = useState(entry.date          || '');
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState('');

  // LocationPicker callback — updates lat/lng and optionally the location name
  const handleLocationChange = useCallback((lat, lng, displayName) => {
    setLatitude(String(lat));
    setLongitude(String(lng));
    // Only overwrite locationName if it's currently empty or the user picked via search
    if (displayName && !locationName) {
      // Use just the first segment of the display name (e.g. "Churaumi Aquarium")
      setLocationName(displayName.split(',')[0].trim());
    }
  }, [locationName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const updated = await api.updateEntry(entry.id, {
        caption,
        location_name: locationName,
        latitude:  latitude  !== '' ? latitude  : null,
        longitude: longitude !== '' ? longitude : null,
        category,
        date,
      }, password);

      if (updated.error) { setError(updated.error); return; }
      onSave(updated);
    } catch {
      setError('Save failed — please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-2 mb-1 bg-cinna-sky-pale/60 rounded-2xl p-4 flex flex-col gap-3 border border-cinna-sky/20"
    >
      <p className="font-nunito font-bold text-cinna-text text-sm">Edit details</p>

      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Caption…"
        rows={3}
        className="admin-input resize-none"
      />

      <input
        type="text"
        value={locationName}
        onChange={(e) => setLocationName(e.target.value)}
        placeholder="Location name"
        className="admin-input"
      />

      {/* Location picker — replaces raw lat/lng inputs */}
      <LocationPicker
        latitude={latitude}
        longitude={longitude}
        onLocationChange={handleLocationChange}
      />

      <div className="grid grid-cols-2 gap-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="admin-input"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="admin-input"
        />
      </div>

      {error && (
        <p className="font-nunito text-red-400 text-xs bg-red-50 rounded-xl px-3 py-2">{error}</p>
      )}

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-full border border-gray-200 text-cinna-text-soft font-nunito font-semibold text-sm hover:bg-white transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 rounded-full bg-cinna-sky text-white font-nunito font-bold text-sm shadow-soft hover:bg-cinna-sky/90 transition disabled:opacity-50"
        >
          {loading ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}
