import { useListaMemorandums } from '../hooks/useListaMemorandums';
import '@/features/modulo-correspondencia/memorandum/styles/listaMemorandums.css';
import { useState } from 'react';
import { DetalleMemorandumModal } from './DetalleMemorandumModal';
import { pickFecha, formatDateDisplay } from '@/shared/utils/dateUtils';

export const ListaMemorandums = () => {
  const { memorandums, loading, error, recargar, idArea, nombreArea } = useListaMemorandums();
  const [detalleId, setDetalleId] = useState(null);

  // Utiliza helpers compartidos para normalizar y mostrar fechas
  const formatFecha = (obj, fallback) => formatDateDisplay(pickFecha(obj) || fallback);

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
        <h2>Memorandums pendientes revisión</h2>
        <div className="header-info">
          <span className="area-badge">{nombreArea ?? (idArea ? `Área ${idArea}` : 'Sin área')}</span>
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
                <th>#</th>
                <th>Folio Correspondencia</th>
                <th>Asunto</th>
                <th>Folio Memorandum</th>
                <th>Emisor</th>
                <th>Fecha Emisión</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {memorandums.map((memo, index) => (
                <tr key={memo.id}>
                  <td>{index + 1}</td>
                  <td>{memo.folioUnicoCorrespondencia || memo.folioCorrespondencia || '-'}</td>
                  <td>{memo.asuntoCorrespondencia || memo.asunto || '-'}</td>
                  <td>{memo.folioUnico || memo.id || '-'}</td>
                  <td>{memo.nombreUsuarioEmisor || memo.remitente || memo.nombreRemitente || '-'}</td>
                  <td>{formatFecha(memo, memo.fechaEmision)}</td>
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
        <DetalleMemorandumModal 
          idMemo={detalleId} 
          onClose={() => setDetalleId(null)}
          onActualizarLista={recargar}
        />
      )}

      <div className="lista-footer">
        <span>Total: {memorandums.length} memorandums</span>
      </div>
    </div>
  );
};