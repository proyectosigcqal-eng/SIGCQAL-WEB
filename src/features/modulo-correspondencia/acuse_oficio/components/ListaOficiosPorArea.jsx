import { useNavigate } from 'react-router-dom';
import { useListaOficiosPorArea } from '../hooks/useListaOficiosPorArea';
import '@/features/modulo-correspondencia/oficio/styles/listaOficiosPorArea.css';
import { pickFecha, formatDateDisplay } from '@/shared/utils/dateUtils';

export const ListaOficiosPorArea = () => {
  const { oficios, loading, error, recargar, areaForzada } = useListaOficiosPorArea();
  const navigate = useNavigate();

  const formatFecha = (obj, fallback) => formatDateDisplay(pickFecha(obj) || fallback);

  if (loading) return <div className="lista-memorandums-area-container"><div className="loading-state"><div className="spinner"></div><p>Cargando oficios...</p></div></div>;
  if (error) return <div className="lista-memorandums-area-container"><div className="error-state"><p>Error: {error}</p><button onClick={recargar} className="btn-reintentar">Reintentar</button></div></div>;

  return (
    <div className="lista-memorandums-area-container">
      <div className="lista-header">
        <h2>Oficios asignados</h2>
        <div className="header-info">
          <span className="area-badge">Área: {areaForzada}</span>
          <button onClick={recargar} className="btn-actualizar">↻ Actualizar</button>
        </div>
      </div>

      {oficios.length === 0 ? (
        <div className="empty-state"><p>No hay oficios para esta área.</p></div>
      ) : (
        <div className="table-wrapper">
          <table className="memorandums-area-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Folio Oficio</th>
                <th>Asunto</th>
                <th>Emisor</th>
                <th>Fecha Emisión</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {oficios.map((oficio, index) => (
                <tr key={oficio.id}>
                  <td>{index + 1}</td>
                  <td>{oficio.folioUnico || '-'}</td>
                  <td>{oficio.asuntoCorrespondencia || oficio.observaciones || '-'}</td>
                  <td>{oficio.nombreUsuarioEmisor || '-'}</td>
                  <td>{formatFecha(oficio, oficio.fechaEmision)}</td>
                  <td>
                    <button
                      className="btn-accion btn-contestacion"
                      onClick={() => navigate(`/correspondencia/contestacion-oficio/${oficio.id}`)}
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
        <span>Total: {oficios.length} oficios</span>
      </div>
    </div>
  );
};