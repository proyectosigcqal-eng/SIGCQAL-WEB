import { useEffect, useState } from 'react';
import { obtenerMemorandumPorId } from '../services/memorandumService';
import './detalleMemorandumModal.css';

export const DetalleMemorandumModal = ({ idMemo, onClose }) => {
  const [memo, setMemo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idMemo) return;
    setLoading(true);
    obtenerMemorandumPorId(idMemo)
      .then(data => {
        setMemo(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Error al cargar el memorándum');
        setLoading(false);
      });
  }, [idMemo]);

  if (!idMemo) return null;

  // Utilidades para fecha/hora
  const fecha = memo?.fechaEmision ? new Date(memo.fechaEmision) : null;
  const fechaStr = fecha ? fecha.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-';
  const horaStr = fecha ? fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : '-';

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        {loading ? (
          <div className="modal-loading">Cargando...</div>
        ) : error ? (
          <div className="modal-error">{error}</div>
        ) : (
          <div className="detalle-memorandum">
            <h2>Detalles Memorandum <span>{memo.folioUnico || memo.id}</span></h2>
            <div className="detalle-grid">
            <div>
                    <strong>FOLIO ÚNICO</strong>
                    <div>{memo.folioUnico || '-'}</div>
                </div>
                <div>
                    <strong>ÁREA</strong>
                    <div>{memo.idArea || '-'}</div>
                </div>
                <div>
                    <strong>FECHA</strong>
                    <div>{fechaStr}</div>
                </div>
                <div>
                    <strong>HORA</strong>
                    <div>{horaStr}</div>
                </div>
                <div>
                    <strong>USUARIO EMISOR</strong>
                    <div>{memo.nombreUsuarioEmisor || '-'}</div>
                </div>
                <div>
                    <strong>USUARIO FIRMANTE</strong>
                    <div>{memo.nombreUsuarioFirmante || '-'}</div>
                </div>
                <div>
                    <strong>INSTRUCCIÓN SEGUIMIENTO</strong>
                    <div>{memo.instruccionSeguimiento || '-'}</div>
                </div>
                <div className="detalle-contenido">
                    <strong>CONTENIDO</strong>
                    <div>{memo.observaciones || '-'}</div>
                </div>
                </div>
            <div className="detalle-botones">
              <button className="btn-si">Si es del área.</button>
              <button className="btn-no">No es del área</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
