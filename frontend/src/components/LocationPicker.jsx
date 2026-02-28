/**
 * LocationPicker
 * A small interactive Leaflet map that lets you pick a location by:
 *   1. Typing a place name and clicking "Find" (Nominatim geocoding)
 *   2. Clicking anywhere on the map to drop a pin
 *
 * Props:
 *   latitude         {number|string} — current lat value (pre-fills the marker)
 *   longitude        {number|string} — current lng value
 *   onLocationChange (lat, lng, displayName?) — called whenever the pin moves
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

const OKINAWA = [26.3344, 127.8056];
const NOMINATIM = 'https://nominatim.openstreetmap.org/search';

// Custom pin icon (reuses the same style as MapSection)
const pinIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:32px; height:32px;
    background: linear-gradient(135deg, #FFB6C1, #C8B4E3);
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0,0,0,0.25);
    display:flex; align-items:center; justify-content:center;
    font-size:14px;
  ">📍</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -18],
});

// Inner component — handles map click events and syncs marker position
function MapController({ position, onMapClick }) {
  const map = useMap();

  // Pan map when position changes externally (e.g. after Nominatim search)
  useEffect(() => {
    if (position) map.setView(position, Math.max(map.getZoom(), 13));
  }, [position, map]);

  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}

export default function LocationPicker({ latitude, longitude, onLocationChange }) {
  const [query, setQuery]     = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const lat = latitude  ? parseFloat(latitude)  : null;
  const lng = longitude ? parseFloat(longitude) : null;
  const position = lat && lng ? [lat, lng] : null;

  const handleMapClick = useCallback((newLat, newLng) => {
    onLocationChange(newLat, newLng, null);
  }, [onLocationChange]);

  const handleSearch = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setSearchError('');
    try {
      const url = `${NOMINATIM}?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=jp`;
      const res = await fetch(url, {
        headers: { 'Accept-Language': 'en', 'User-Agent': 'OkinawaDiaries/1.0' },
      });
      const data = await res.json();
      if (!data.length) {
        setSearchError('Location not found — try a more specific name.');
        return;
      }
      const { lat: rLat, lon: rLon, display_name } = data[0];
      onLocationChange(parseFloat(rLat), parseFloat(rLon), display_name);
    } catch {
      setSearchError('Search failed — check your internet connection.');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Search bar — intentionally a div, not a form, to avoid nested-form conflicts */}
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch(e))}
          placeholder="Search a location (e.g. Churaumi Aquarium)"
          className="admin-input flex-1"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={searching || !query.trim()}
          className="px-4 py-2 rounded-2xl bg-cinna-sky text-white font-nunito font-bold text-sm whitespace-nowrap hover:bg-cinna-sky/80 transition disabled:opacity-50"
        >
          {searching ? '…' : 'Find'}
        </button>
      </div>

      {searchError && (
        <p className="font-nunito text-red-400 text-xs">{searchError}</p>
      )}

      <p className="font-nunito text-cinna-text-soft text-xs">
        Or click anywhere on the map to drop a pin
      </p>

      {/* Map */}
      <div className="rounded-2xl overflow-hidden border border-cinna-sky/30" style={{ height: 220 }}>
        <MapContainer
          center={position || OKINAWA}
          zoom={position ? 13 : 10}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            subdomains="abcd"
          />
          <MapController position={position} onMapClick={handleMapClick} />
          {position && <Marker position={position} icon={pinIcon} />}
        </MapContainer>
      </div>

      {/* Coordinate readout */}
      {position && (
        <p className="font-nunito text-cinna-text-soft/70 text-xs text-right">
          📍 {lat.toFixed(5)}, {lng.toFixed(5)}
        </p>
      )}
    </div>
  );
}
