import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function AddMarkerEvent({ onAddMarker }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onAddMarker(lat, lng);
    }
  });
  return null;
}

function MapComponent({ onAddMarker, userMarkers }) {
  return (
    <MapContainer center={[62.0281, 129.7326]} zoom={6} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <AddMarkerEvent onAddMarker={onAddMarker} />
      {userMarkers.map(marker => (
        <Marker key={marker.id} position={[marker.lat, marker.lng]}>
          <Popup>
            <b>{marker.title}</b><br />{marker.description}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapComponent;