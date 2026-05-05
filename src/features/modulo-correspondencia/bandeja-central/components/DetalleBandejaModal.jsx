import React, { useState } from 'react';

const overlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
};

const modalStyle = {
  background: '#fff', borderRadius: 8, width: '90%', maxWidth: 720, padding: '1.25rem', boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
};

export default function DetalleBandejaModal({ isOpen, onClose, item, onCerrarSeguimiento }) {
  const [comentario, setComentario] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !item) return null;

  const handleCerrar = async () => {
    if (!window.confirm('¿Confirmas cerrar el seguimiento de este trámite?')) return;
    setLoading(true);
    try {
      await onCerrarSeguimiento(item, comentario);
      setLoading(false);
      setComentario('');
      onClose();
    } catch (e) {
      setLoading(false);
      console.error(e);
      alert('Ocurrió un error al cerrar el seguimiento.');
    }
  };

  return (
    <div style={overlayStyle} role="dialog" aria-modal="true">
      <div style={modalStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>{item.folio || 'Detalle'}</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: 18 }}>✖</button>
        </div>

        <div style={{ marginBottom: 12 }}>
          <p><strong>Tipo:</strong> {item.tipo}</p>
          <p><strong>Asunto:</strong> {item.asunto || '-'}</p>
          <p><strong>Fecha:</strong> {item.fecha ? new Date(item.fecha).toLocaleString() : '-'}</p>
          <p><strong>Estatus:</strong> {item.estatus || '-'}</p>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 6 }}>Comentario (opcional):</label>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            rows={4}
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
            placeholder="Descripción de la resolución o comentario para la bitácora"
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onClose} style={{ padding: '8px 12px', background: '#eee', border: 'none', borderRadius: 4 }}>Cancelar</button>
          <button onClick={handleCerrar} disabled={loading} style={{ padding: '8px 12px', background: '#0078d4', color: '#fff', border: 'none', borderRadius: 4 }}>
            {loading ? 'Procesando...' : 'Cerrar seguimiento'}
          </button>
        </div>
      </div>
    </div>
  );
}
