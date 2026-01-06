// src/WeatherWidget.jsx
import { useState, useEffect } from 'react';

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const API_KEY = '2ddc2adc8da06572cecb1d725cdde80c'; // ← ВСТАВЬ СВОЙ КЛЮЧ СЮДА
    const LAT = 62.0281;
    const LON = 129.7326;

    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&lang=ru&units=metric`)
      .then(res => {
        if (!res.ok) throw new Error('Ошибка API: ' + res.status);
        return res.json();
      })
      .then(data => {
        setWeather({
          temp: Math.round(data.main.temp),
          desc: data.weather[0].description
        });
      })
      .catch(err => {
        console.error('Ошибка:', err);
        setError('Погода недоступна');
      });
  }, []);

  if (error) return <div style={styles.widget}>⚠️ {error}</div>;
  if (!weather) return <div style={styles.widget}>Загрузка...</div>;

  return (
    <div style={styles.widget}>
      🌡️ {weather.temp}°C<br />
      <small>{weather.desc}</small>
    </div>
  );
}

const styles = {
  widget: {
    backgroundColor: 'rgba(0,150,136,0.3)',
    border: '1px solid #009688',
    borderRadius: '6px',
    padding: '8px 12px',
    color: 'white',
    minWidth: '120px',
    textAlign: 'center'
  }
};