import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';



// Иконка маркера
const userIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Стили: снежная тема
const theme = {
  background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
  text: '#0d47a1',
  headerBg: 'rgba(255, 255, 255, 0.95)',
  buttonBg: '#009688',
  panelBg: 'rgba(255, 255, 255, 0.95)',
  shadow: '0 2px 12px rgba(0, 0, 0, 0.15)',
};

// Кнопка "Моё местоположение"
function LocateUserButton({ onLocate }) {
  return (
    <button
      onClick={onLocate}
      style={{
        position: 'absolute',
        top: '80px',
        right: '20px',
        zIndex: 1000,
        width: '44px',
        height: '44px',
        background: theme.buttonBg,
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        fontSize: '18px',
        boxShadow: theme.shadow,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      title="Моё местоположение"
    >
      📍
    </button>
  );
}

// Кнопка "Добавить метку"
function AddMarkerButton({ onClick }) {
  const map = useMap();
  return (
    <button
      onClick={() => {
        const center = map.getCenter();
        onClick(center.lat, center.lng);
      }}
      style={{
        position: 'absolute',
        top: '140px',
        right: '20px',
        zIndex: 1000,
        padding: '10px 16px',
        background: theme.buttonBg,
        color: 'white',
        border: 'none',
        borderRadius: '20px',
        cursor: 'pointer',
        fontSize: '14px',
        boxShadow: theme.shadow,
        fontWeight: '600'
      }}
    >
      ➕ Добавить метку
    </button>
  );
}

// Переключатель карт
function MapLayersControl({ onLayerChange }) {
  const layers = [
    { name: 'OSM (дороги)', id: 'osm' },
    { name: 'Спутник', id: 'satellite' },
    { name: 'Рельеф', id: 'terrain' },
    { name: 'Светлая', id: 'carto' },
  ];

  return (
    <div style={{
      position: 'absolute',
      top: '200px',
      right: '20px',
      zIndex: 1000,
      background: theme.panelBg,
      borderRadius: '12px',
      padding: '12px',
      boxShadow: theme.shadow,
      border: '1px solid #e0e0e0'
    }}>
      <div style={{ fontSize: '12px', marginBottom: '8px', color: '#555', fontWeight: '600' }}>Карта:</div>
      {layers.map(layer => (
        <div key={layer.id} style={{ marginBottom: '6px' }}>
          <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '13px' }}>
            <input
              type="radio"
              name="map-layer"
              value={layer.id}
              onChange={() => onLayerChange(layer.id)}
              defaultChecked={layer.id === 'osm'}
              style={{ marginRight: '8px' }}
            />
            {layer.name}
          </label>
        </div>
      ))}
    </div>
  );
}

// Модальное окно добавления метки
function AddMarkerModal({ position, onSave, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('ice');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...position, title, description, type, id: Date.now() });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 2000
    }}>
      <div style={{
        background: 'white', padding: '24px', borderRadius: '16px',
        width: '400px', boxShadow: '0 6px 24px rgba(0,0,0,0.2)',
        border: '1px solid #e0e0e0'
      }}>
        <h3 style={{ margin: '0 0 16px 0', color: theme.text, fontWeight: '600' }}>Добавить метку</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Название (необязательно)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%', padding: '12px', margin: '6px 0',
              background: '#f8f9fa', border: '1px solid #ccc', borderRadius: '8px',
              fontSize: '14px'
            }}
          />
          <textarea
            placeholder="Описание (обязательно)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: '100%', padding: '12px', margin: '6px 0',
              background: '#f8f9fa', border: '1px solid #ccc', borderRadius: '8px',
              fontSize: '14px'
            }}
            rows="3"
            required
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{
              width: '100%', padding: '12px', margin: '6px 0',
              background: '#f8f9fa', border: '1px solid #ccc', borderRadius: '8px',
              fontSize: '14px'
            }}
          >
            <option value="ice">Обледенение</option>
            <option value="fuel">Заправка</option>
            <option value="heating_point">Пункт обогрева</option>
            <option value="road_damage">Размыв дороги</option>
            <option value="danger">Опасный участок</option>
            <option value="shop">Магазин</option>
          </select>
          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px', background: '#f5f5f5', color: '#333',
                border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer',
                marginRight: '10px', fontSize: '14px'
              }}
            >
              Отмена
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 20px', background: theme.buttonBg, color: 'white',
                border: 'none', borderRadius: '8px', cursor: 'pointer',
                fontSize: '14px', fontWeight: '600'
              }}
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Слои карт
const LAYERS = {
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri'
  },
  terrain: {
    url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png',
    attribution: 'Map tiles by Stamen Design, CC BY 3.0',
    subdomains: 'abcd'
  },
  carto: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap, CARTO'
  }
};

function CustomTileLayer({ layerId }) {
  const layer = LAYERS[layerId];
  if (layerId === 'terrain') {
    return <TileLayer url={layer.url} attribution={layer.attribution} subdomains={layer.subdomains} />;
  }
  return <TileLayer url={layer.url} attribution={layer.attribution} />;
}

export default function App() {
  const [markers, setMarkers] = useState(() => {
    const saved = localStorage.getItem('userMarkers');
    return saved ? JSON.parse(saved) : [];
  });
  const [modalPos, setModalPos] = useState(null);
  const [currentLayer, setCurrentLayer] = useState('osm');
  const [userLocation, setUserLocation] = useState(null);
  const [initialCenter, setInitialCenter] = useState([62.0281, 129.7326]);
  const [showEmergency, setShowEmergency] = useState(false);

  // Снежинки в шапке
  useEffect(() => {
    const snowContainer = document.getElementById('snow-container');
    if (!snowContainer) return;

    const snowflakes = ['❄', '❅', '❆'];
    const count = 12;

    for (let i = 0; i < count; i++) {
      const snowflake = document.createElement('div');
      snowflake.className = 'snowflake';
      snowflake.innerHTML = snowflakes[Math.floor(Math.random() * snowflakes.length)];
      snowflake.style.left = `${Math.random() * 100}%`;
      snowflake.style.fontSize = `${12 + Math.random() * 12}px`;
      snowflake.style.animationDuration = `${6 + Math.random() * 6}s`;
      snowflake.style.animationDelay = `${Math.random() * 5}s`;
      snowContainer.appendChild(snowflake);
    }

    return () => {
      if (snowContainer) snowContainer.innerHTML = '';
    };
  }, []);

  // Геолокация
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setInitialCenter([latitude, longitude]);
        },
        () => {}
      );
    }
  }, []);

  // Сохранение меток
  useEffect(() => {
    localStorage.setItem('userMarkers', JSON.stringify(markers));
  }, [markers]);

  const handleAddMarker = (lat, lng) => {
    setModalPos({ lat, lng });
  };

  const handleSaveMarker = (marker) => {
    setMarkers([...markers, marker]);
    setModalPos(null);
  };

  const handleDeleteMarker = (id) => {
    setMarkers(markers.filter(m => m.id !== id));
  };

  const closeModal = () => {
    setModalPos(null);
  };

  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setInitialCenter([latitude, longitude]);
        },
        (error) => {
          alert('Не удалось определить местоположение: ' + error.message);
        }
      );
    }
  };

  return (
    <div style={{ height: '100vh', width: '100%', background: theme.background, color: theme.text }}>
      {/* Шапка */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '12px 20px',
        background: theme.headerBg, boxShadow: theme.shadow,
        borderBottom: '1px solid #e0e0e0',
        position: 'relative',
        zIndex: 20
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: theme.text }}>Trucks Yakutia</h2>
          <div style={{
            fontSize: '12px', color: '#555', marginTop: '4px',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            📞 Служба помощи дальнобойщикам
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
         
          <button
            onClick={() => setShowEmergency(true)}
            style={{
              background: '#ffcdd2', color: '#b71c1c', border: 'none',
              borderRadius: '20px', padding: '6px 12px', fontSize: '13px',
              fontWeight: '600', cursor: 'pointer', display: 'flex',
              alignItems: 'center', gap: '4px'
            }}
          >
            🆘 Экстренные номера
          </button>
        </div>

        <div className="snow-container" id="snow-container"></div>
      </div>

      {/* Карта */}
      <MapContainer
        center={initialCenter}
        zoom={6}
        style={{ height: 'calc(100% - 60px)', width: '100%' }}
      >
        <CustomTileLayer layerId={currentLayer} />
        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>Вы здесь</Popup>
          </Marker>
        )}
        <LocateUserButton onLocate={handleLocateUser} />
        <AddMarkerButton onClick={handleAddMarker} />
        <MapLayersControl onLayerChange={setCurrentLayer} />
        {markers.map(marker => (
          <Marker key={marker.id} position={[marker.lat, marker.lng]}>
            <Popup>
              <div>
                <b>{marker.title || marker.type}</b><br />
                {marker.description}<br />
                <button
                  onClick={() => handleDeleteMarker(marker.id)}
                  style={{
                    marginTop: '8px', padding: '5px 10px',
                    background: '#d32f2f', color: 'white',
                    border: 'none', borderRadius: '4px', cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Удалить
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Модальные окна */}
      {modalPos && (
        <AddMarkerModal
          position={modalPos}
          onSave={handleSaveMarker}
          onClose={closeModal}
        />
      )}

      {showEmergency && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 3000
        }}>
          <div style={{
            background: 'white', borderRadius: '16px', padding: '24px',
            width: '90%', maxWidth: '400px', maxHeight: '80vh', overflowY: 'auto',
            boxShadow: '0 6px 24px rgba(0,0,0,0.3)', border: '1px solid #e0e0e0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#0d47a1' }}>🆘 Экстренные номера — Якутия</h3>
              <button
                onClick={() => setShowEmergency(false)}
                style={{
                  background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '50%',
                  width: '32px', height: '32px', fontSize: '18px', cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { name: 'Единый номер спасения', number: '112' },
                { name: 'Полиция', number: '102' },
                { name: 'МЧС (пожар/спасение)', number: '101' },
                { name: 'Скорая помощь', number: '103' },
                { name: 'ГИБДД Якутск', number: '+7 (4112) 42-44-44' },
                { name: 'Разморозка п. Нижний Бестях', number: '+7 (999)-244-71-67' },
                { name: 'Дорожная инспекция', number: '+7 (4112) 34-56-78' },
                { name: 'Ространснадзор', number: '8-800-550-83-45' },
                { name: 'Гараж п. Нижний Бестях', number: '+7 (924)-367-63-48' }
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px', background: '#f8f9fa', borderRadius: '8px'
                }}>
                  <span style={{ fontWeight: '600', fontSize: '14px' }}>{item.name}</span>
                  <a
                    href={`tel:${item.number.replace(/\D/g, '')}`}
                    style={{
                      background: '#e3f2fd', color: '#0d47a1', padding: '6px 12px',
                      borderRadius: '20px', textDecoration: 'none', fontSize: '13px',
                      fontWeight: '600', border: '1px solid #bbdefb'
                    }}
                  >
                    {item.number}
                  </a>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '20px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
              Нажмите на номер, чтобы позвонить
            </div>
          </div>
        </div>
      )}
    </div>
  );
}