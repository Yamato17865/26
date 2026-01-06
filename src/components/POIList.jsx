function POIList({ markers }) {
  return (
    <div className="poi-list">
      <h3>Пользовательские метки</h3>
      {markers.length === 0 ? (
        <p>Нет добавленных меток</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {markers.map(m => (
            <li key={m.id} style={{ marginBottom: '10px', padding: '8px', background: '#1a2a3a', borderRadius: '4px' }}>
              <strong>{m.title}</strong> ({m.type})<br />
              {m.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default POIList;