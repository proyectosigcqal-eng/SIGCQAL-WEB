import { useListaMemorandums } from '../hooks/useListaMemorandums';
import '@/features/modulo-correspondencia/memorandum/styles/listaMemorandums.css';
import { useState } from 'react';
import { DetalleMemorandumModal } from './DetalleMemorandumModal';

export const ListaMemorandums = () => {
  const { memorandums, loading, error, recargar, areaForzada } = useListaMemorandums();
  const [detalleId, setDetalleId] = useState(null);

  const formatearFecha = (fecha) => {
    if (!fecha) return '-';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="lista-memorandums-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando memorandums...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lista-memorandums-container">
        <div className="error-state">
          <p>Error al cargar: {error}</p>
          <button onClick={recargar} className="btn-reintentar">Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="lista-memorandums-container">
      <div className="lista-header">
        <h2>Lista de Memorandums</h2>
        <div className="header-info">
          <span className="area-badge">Área: {areaForzada}</span>
          <button onClick={recargar} className="btn-actualizar">
            ↻ Actualizar
          </button>
        </div>
      </div>

      {memorandums.length === 0 ? (
        <div className="empty-state">
          <p>No hay memorandums para esta área.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="memorandums-table">
            <thead>
              <tr>
                <th>Fecha Emisión</th>
                <th>Folio Único</th>
                <th>Emisor</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {memorandums.map((memo) => (
                <tr key={memo.id}>
                  <td>{formatearFecha(memo.fechaEmision)}</td>
                  <td>{memo.folioUnico || '-'}</td>
                  <td>{memo.nombreUsuarioEmisor || '-'}</td>
                  <td>
                    <button 
                      className="btn-ver-detalle"
                      onClick={() => setDetalleId(memo.id)}
                    >
                      Ver Detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de detalle */}
      {detalleId && (
        <DetalleMemorandumModal idMemo={detalleId} onClose={() => setDetalleId(null)} />
      )}

      <div className="lista-footer">
        <span>Total: {memorandums.length} memorandums</span>
      </div>
    </div>
  );
};