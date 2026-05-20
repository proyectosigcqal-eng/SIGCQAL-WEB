import { useNavigate } from 'react-router-dom';
import { useListaAcusesCorrespondenciaPorArea } from '../hooks/useListaAcusesCorrespondenciaPorArea';
import '@/features/modulo-correspondencia/acusecorrespondencia/styles/listaAcusesCorrespondencia.css';
import { pickFecha, formatDateDisplay } from '@/shared/utils/dateUtils';

export const ListaAcusesCorrespondenciaPorArea = () => {
  const { acuses, loading, error, recargar, areaForzada } = useListaAcusesCorrespondenciaPorArea();
  const navigate = useNavigate();

  const formatFecha = (obj, fallback) => formatDateDisplay(pickFecha(obj) || fallback);

  if (loading) {
    return (
      <div className="lista-acuses-correspondencia-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando acuses de correspondencia por área...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lista-acuses-correspondencia-container">
        <div className="error-state">
          <p>Error al cargar: {error}</p>
          <button onClick={recargar} className="btn-reintentar">Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="lista-acuses-correspondencia-container">
      <div className="lista-header">
        <h2>Correspondencia asignada</h2>
        <div className="header-info">
          <span className="area-badge">Área: {areaForzada}</span>
          <button onClick={recargar} className="btn-actualizar-acuse">
            ↻ Actualizar
          </button>
        </div>
      </div>

      {acuses.length === 0 ? (
        <div className="empty-state">
          <p>No hay acuses de correspondencia para esta área.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="acuses-correspondencia-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Folio Unico</th>
                <th>Dependencia Remitente</th>
                <th>Asunto</th>
                <th>Fecha Expedicion</th>
                <th>Fecha Aceptacion</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {acuses.map((acuse, index) => (
                <tr key={acuse.id || index}>
                  <td className="num-index">{index + 1}</td>
                  <td>{acuse.folioUnico || '-'}</td>
                  <td>{acuse.dependenciaRemitente || '-'}</td>
                  <td>{acuse.asunto || '-'}</td>
                  <td>{formatFecha(acuse, acuse.fechaExpedicion)}</td>
                  <td>{formatFecha(acuse, acuse.fechaAceptacion)}</td>
                  <td>
                    <button 
                      className="btn-contestacion-acuse-correspondencia"
                      onClick={() => {
                        const idDestino = acuse.idAcuseCorrespondencia || acuse.id;
                        if (idDestino) {
                          navigate(`/correspondencia/contestacion-correspondencia/${idDestino}`);
                        } else {
                          console.error("No se encontró el idAcuseCorrespondencia para navegar.");
                        }
                      }}
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