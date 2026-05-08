import { useListaOficios } from '../hooks/useListaOficios';
import '@/features/modulo-correspondencia/oficio/styles/listaOficios.css';
import { useState } from 'react';
import { DetalleOficioModal } from './DetalleOficioModal';

export const ListaOficios = () => {
  const { oficios, loading, error, recargar, areaForzada } = useListaOficios();
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
          <p>Cargando oficios...</p>
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
        <h2>Oficios pendientes revisión</h2>
        <div className="header-info">
          <span className="area-badge">Área: {areaForzada}</span>
          <button onClick={recargar} className="btn-actualizar">
            ↻ Actualizar
          </button>
        </div>
      </div>

      {oficios.length === 0 ? (
        <div className="empty-state">
          <p>No hay oficios para esta área.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="memorandums-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Folio Oficio</th>
                <th>Folio Correspondencia</th>
                <th>Asunto</th>
                <th>Emisor</th>
                <th>Fecha Emisión</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {oficios.map((of, index) => (
                <tr key={of.id}>
                  <td>{index + 1}</td>
                  <td>{of.folioUnico || of.id || '-'}</td>
                  <td>{of.folioUnicoCorrespondencia || of.folioCorrespondencia || '-'}</td>
                  <td>{of.asuntoCorrespondencia || of.asunto || '-'}</td>
                  <td>{of.nombreUsuarioEmisor || of.remitente || of.nombreRemitente || '-'}</td>
                  <td>{formatearFecha(of.fechaEmision)}</td>
                  <td>
                    <button 
                      className="btn-ver-detalle"
                      onClick={() => setDetalleId(of.id)}
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

      {detalleId && (
        <DetalleOficioModal 
          idOficio={detalleId} 
          onClose={() => setDetalleId(null)}
          onActualizarLista={recargar}
        />
      )}

      <div className="lista-footer">
        <span>Total: {oficios.length} oficios</span>
      </div>
    </div>
  );
};
