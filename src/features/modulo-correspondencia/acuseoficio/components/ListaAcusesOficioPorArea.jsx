import { useListaAcusesOficioPorArea } from '../hooks/useListaAcusesOficioPorArea'; 
import '@/features/modulo-correspondencia/acuseoficio/styles/listaAcusesOficio.css';

export const ListaAcusesOficioPorArea = () => {
  const { acuses, loading, error, recargar, areaForzada } = useListaAcusesOficioPorArea();

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
      <div className="lista-acuses-oficio-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando acuses de oficio por área...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lista-acuses-oficio-container">
        <div className="error-state">
          <p>Error al cargar: {error}</p>
          <button onClick={recargar} className="btn-reintentar">Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="lista-acuses-oficio-container">
      <div className="lista-header">
        <h2>Oficios asignados</h2>
        <div className="header-info">
          <span className="area-badge">Área: {areaForzada}</span>
          <button onClick={recargar} className="btn-actualizar-acuse">
            ↻ Actualizar
          </button>
        </div>
      </div>

      {acuses.length === 0 ? (
        <div className="empty-state">
          <p>No hay acuses de oficio para esta área.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="acuses-oficio-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Número de Oficio</th>
                <th>Folio Único</th>
                <th>Nombre Area</th>
                <th>Fecha Emisión</th>
                <th>Fecha Aceptación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {acuses.map((acuse, index) => (
                <tr key={acuse.id || index}>
                  <td className="num-index">{index + 1}</td>
                  <td>{acuse.numOficio || '-'}</td>
                  
                  <td>{acuse.folioUnico || '-'}</td>
                  <td>{acuse.nombreArea || '-'}</td>
                  <td>{formatearFecha(acuse.fechaEmision)}</td>
                  <td>{formatearFecha(acuse.fechaAceptacion)}</td>
                  <td>
                    <button className="btn-contestacion-acuse-oficio">
                      Contestacion
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="lista-footer">
        <span>Total: {acuses.length} acuses</span>
      </div>
    </div>
  );
};