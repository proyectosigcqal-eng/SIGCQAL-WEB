import { useCorrespondenciaPendientePorArea } from '../hooks/useCorrespondenciaPendientePorArea';
import { DetalleCorrespondenciaModal } from './DetalleCorrespondenciaModal';
import { useState } from 'react';
import '@/features/modulo-correspondencia/correspondencia/styles/correspondenciaPendiente.css';

export const ListaCorrespondenciaPendiente = () => {
  const { correspondencia, loading, error, recargar, idArea, nombreArea } = useCorrespondenciaPendientePorArea();
  const [detalleId, setDetalleId] = useState(null);

  const verDetalles = (item) => {
    setDetalleId(item.id);
  };

  return (
    <div className="lista-memorandums-container">
      
      {/* Header */}
      <div className="lista-header">
        <h2>Correspondencia pendiente revisión</h2>

        <div className="header-info">
          <span className="area-badge">
            {nombreArea ?? (idArea ? `Área ${idArea}` : 'Sin área')}
          </span>

          <button className="btn-actualizar" onClick={recargar}>
           ↻ Actualizar
          </button>
        </div>
      </div>

      {/* Estados */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando correspondencia...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>Error al cargar: {error}</p>
          <button className="btn-reintentar" onClick={recargar}>
            Reintentar
          </button>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="memorandums-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Folio</th>
                <th>No. Oficio</th>
                <th>Asunto</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {correspondencia.length > 0 ? (
                correspondencia.map((item, index) => (
                  <tr key={item.id || index}>
                    <td className="num-memo">{index + 1}</td>

                    <td>
                      {item.folioUnico || item.folio || '-'}
                    </td>

                    <td>
                      {item.numeroOficio || item.nroOficio || item.oficio || '-'}
                    </td>

                    <td className="asunto-cell">
                      {item.asunto || item.descripcion || '-'}
                    </td>

                    <td>
                      <button
                        className="btn-ver-detalle"
                        onClick={() => verDetalles(item)}
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">
                    <div className="empty-state">
                      No hay correspondencia pendiente en esta área.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer opcional */}
      <div className="lista-footer">
        Total: {correspondencia.length} registros
      </div>

      {/* Modal */}
      {detalleId && (
        <DetalleCorrespondenciaModal
          idCorrespondencia={detalleId}
          onClose={() => setDetalleId(null)}
        />
      )}
    </div>
  );
};