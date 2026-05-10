import { useEffect, useRef, useState } from 'react';
import { MapPin, Search, X } from 'lucide-react';

// Leaflet requires CSS — import it once here
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's broken default icon paths in Vite
let L;
async function getLeaflet() {
  if (L) return L;
  L = (await import('leaflet')).default;
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
  return L;
}

const MAHARASHTRA_CENTER = [19.7515, 75.7139];
const DEFAULT_ZOOM = 7;

export default function MapPicker({ value, onChange, readOnly = false }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [address, setAddress] = useState(value?.address || '');
  const debounceRef = useRef(null);

  // Initialize map
  useEffect(() => {
    let mounted = true;
    getLeaflet().then(L => {
      if (!mounted || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        center: value?.lat ? [value.lat, value.lng] : MAHARASHTRA_CENTER,
        zoom: value?.lat ? 14 : DEFAULT_ZOOM,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;

      if (value?.lat) {
        const marker = L.marker([value.lat, value.lng], { draggable: !readOnly }).addTo(map);
        markerRef.current = marker;
        if (!readOnly) {
          marker.on('dragend', () => {
            const { lat, lng } = marker.getLatLng();
            reverseGeocode(lat, lng);
          });
        }
      }

      if (!readOnly) {
        map.on('click', e => {
          const { lat, lng } = e.latlng;
          placeMarker(L, map, lat, lng);
          reverseGeocode(lat, lng);
        });
      }
    });

    return () => {
      mounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function placeMarker(L, map, lat, lng) {
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
      markerRef.current = marker;
      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        reverseGeocode(pos.lat, pos.lng);
      });
    }
    map.setView([lat, lng], Math.max(map.getZoom(), 14));
  }

  async function reverseGeocode(lat, lng) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      const addr = data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      setAddress(addr);
      onChange?.({ lat, lng, address: addr });
    } catch {
      const addr = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      setAddress(addr);
      onChange?.({ lat, lng, address: addr });
    }
  }

  function handleQueryChange(e) {
    const q = e.target.value;
    setQuery(q);
    setSuggestions([]);
    clearTimeout(debounceRef.current);
    if (q.length < 3) return;
    debounceRef.current = setTimeout(() => searchNominatim(q), 500);
  }

  async function searchNominatim(q) {
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&countrycodes=in&limit=5`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      setSuggestions(data);
    } catch {
      setSuggestions([]);
    } finally {
      setSearching(false);
    }
  }

  async function selectSuggestion(item) {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    const addr = item.display_name;
    setSuggestions([]);
    setQuery('');
    setAddress(addr);
    onChange?.({ lat, lng, address: addr });
    const L = await getLeaflet();
    if (mapRef.current) placeMarker(L, mapRef.current, lat, lng);
  }

  function clearLocation() {
    if (markerRef.current && mapRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
    setAddress('');
    onChange?.(null);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {!readOnly && (
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={15} style={{ position: 'absolute', left: 12, color: '#64748b', flexShrink: 0 }} />
            <input
              type="text"
              value={query}
              onChange={handleQueryChange}
              placeholder="Search for a college, venue, or area..."
              style={{
                width: '100%',
                padding: '10px 14px 10px 36px',
                backgroundColor: '#0f0f14',
                border: '1px solid #2a2a4a',
                borderRadius: '10px',
                color: '#e2e8f0',
                fontSize: '0.88rem',
                outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = '#4f8ef7'}
              onBlur={e => e.target.style.borderColor = '#2a2a4a'}
            />
            {searching && (
              <div style={{ position: 'absolute', right: 12, width: 14, height: 14, border: '2px solid #4f8ef7', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
            )}
          </div>
          {suggestions.length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000,
              backgroundColor: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: '10px',
              marginTop: '4px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}>
              {suggestions.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => selectSuggestion(item)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                    width: '100%', padding: '10px 14px', background: 'none', border: 'none',
                    cursor: 'pointer', textAlign: 'left', borderBottom: i < suggestions.length - 1 ? '1px solid #2a2a4a' : 'none',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(79,142,247,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <MapPin size={14} style={{ color: '#4f8ef7', flexShrink: 0, marginTop: 2 }} />
                  <span style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.4 }}>{item.display_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Map container */}
      <div
        ref={containerRef}
        style={{
          height: readOnly ? '240px' : '320px',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid #2a2a4a',
          backgroundColor: '#0f0f14',
        }}
      />

      {!readOnly && (
        <p style={{ margin: 0, color: '#64748b', fontSize: '0.78rem' }}>
          Click on the map to drop a pin, or drag the marker to adjust. Search above to jump to a location.
        </p>
      )}

      {address && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: '8px',
          backgroundColor: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.2)',
          borderRadius: '8px', padding: '10px 12px',
        }}>
          <MapPin size={14} style={{ color: '#4f8ef7', flexShrink: 0, marginTop: 2 }} />
          <span style={{ color: '#94a3b8', fontSize: '0.82rem', flex: 1, lineHeight: 1.45 }}>{address}</span>
          {!readOnly && (
            <button type="button" onClick={clearLocation} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 0, flexShrink: 0 }}>
              <X size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
