import { useListaAcusesOficioPorArea } from '../hooks/useListaAcusesOficioPorArea'; 
import '@/features/modulo-correspondencia/acuseoficio/styles/listaAcusesOficio.css';
import { pickFecha, formatDateDisplay } from '@/shared/utils/dateUtils';
import { useNavigate } from 'react-router-dom';

export const ListaAcusesOficioPorArea = () => {
  const { acuses, loading, error, recargar, idArea, nombreArea } = useListaAcusesOficioPorArea();
  const navigate = useNavigate();

  const formatFecha = (obj, fallback) => formatDateDisplay(pickFecha(obj) || fallback);

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
          <span className="area-badge">{nombreArea ?? (idArea ? `Área ${idArea}` : 'Sin área')}</span>
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
                  <td>{formatFecha(acuse, acuse.fechaEmision)}</td>
                  <td>{formatFecha(acuse, acuse.fechaAceptacion)}</td>
                  <td>
                    <button
    className="btn-contestacion-acuse-oficio"
    onClick={() => navigate(`/correspondencia/contestacion-oficio/${acuse.idOficio ?? acuse.id}`)}
  >
    Contestación
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