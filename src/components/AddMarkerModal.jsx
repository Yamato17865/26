import { useState } from 'react';

function AddMarkerModal({ position, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('shop');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, description, type, lat: position.lat, lng: position.lng });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Добавить метку</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Название" value={title} onChange={e => setTitle(e.target.value)} required />
          <textarea placeholder="Описание" value={description} onChange={e => setDescription(e.target.value)} required />
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="shop">Магазин</option>
            <option value="fuel">Заправка</option>
            <option value="rest">Место отдыха</option>
            <option value="danger">Опасный участок</option>
            <option value="ice">Обледенение</option>
            <option value="heating_point">Пункт обогрева</option>
            <option value="road_damage">Размыв дороги</option>
          </select>
          <button type="submit">Сохранить</button>
          <button type="button" onClick={onClose}>Отмена</button>
        </form>
      </div>
    </div>
  );
}

export default AddMarkerModal;