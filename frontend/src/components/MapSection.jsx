import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { api } from '../utils/api';
import SparkleAccent from './SparkleAccent';

// Okinawa centre
const OKINAWA = [26.3344, 127.8056];

// Custom cute pin icon
function makePinIcon(category) {
  const colors = {
    food:    '#FFB6C1',
    scenery: '#87CEEB',
    moments: '#C8B4E3',
  };
  const bg = colors[category] || colors.moments;

  return L.divIcon({
    className: '',
    html: `
      <div style="
        width:38px; height:38px;
        background: ${bg};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 3px 10px rgba(0,0,0,0.22);
        display:flex; align-items:center; justify-content:center;
        font-size:17px; line-height:1;
      ">🌸</div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -22],
  });
}

export default function MapSection() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    api.getEntries().then((data) => {
      setEntries(data.filter((e) => e.latitude && e.longitude));
    }).catch(() => {});
  }, []);

  return (
    <section id="map" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-2">
            <SparkleAccent className="w-5 h-5 animate-sparkle" color="#4ECDC4" />
            <h2 className="font-dancing text-5xl font-bold text-cinna-text">
              Adventures Map 🗺️
            </h2>
            <SparkleAccent className="w-5 h-5 animate-sparkle" style={{ animationDelay: '0.6s' }} color="#FF6B8A" />
          </div>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="h-px w-16 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #4ECDC4)' }} />
            <p className="font-nunito text-cinna-text-soft text-base">
              Pinning every beautiful place on the island
            </p>
            <span className="h-px w-16 rounded-full" style={{ background: 'linear-gradient(90deg, #4ECDC4, transparent)' }} />
          </div>
        </div>

        {/* Map */}
        <div
          className="animate-fade-in-up rounded-4xl overflow-hidden shadow-soft-lg"
          style={{ animationDelay: '0.1s', height: 480 }}
        >
          <MapContainer
            center={OKINAWA}
            zoom={10}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
          >
            {/* CartoDB Positron — soft/light pastel map tiles */}
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              subdomains="abcd"
              maxZoom={20}
            />

            {entries.map((entry) => (
              <Marker
                key={entry.id}
                position={[entry.latitude, entry.longitude]}
                icon={makePinIcon(entry.category)}
              >
                <Popup maxWidth={220}>
                  <div className="font-nunito p-1">
                    {entry.media_type === 'photo' ? (
                      <img
                        src={api.mediaUrl(entry.filename)}
                        alt={entry.location_name}
                        style={{
                          width: '100%',
                          height: 110,
                          objectFit: 'cover',
                          borderRadius: 10,
                          marginBottom: 6,
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%', height: 80, borderRadius: 10,
                        background: '#D4ECFA', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: 28, marginBottom: 6,
                      }}>
                        🎬
                      </div>
                    )}
                    <p style={{ fontWeight: 700, color: '#4A4A6A', margin: '0 0 2px', fontSize: 13 }}>
                      📍 {entry.location_name}
                    </p>
                    {entry.caption && (
                      <p style={{ color: '#8080A4', fontSize: 11, margin: 0, lineHeight: 1.4 }}>
                        {entry.caption.slice(0, 80)}{entry.caption.length > 80 ? '…' : ''}
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </section>
  );
}
