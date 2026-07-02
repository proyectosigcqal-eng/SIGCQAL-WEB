import { useListaMemorandumsPorArea } from '../hooks/useListaMemorandumsPorArea';
import '@/features/modulo-correspondencia/acuserecibointerno/styles/listaMemorandumsPorArea.css';
import { useNavigate } from 'react-router-dom';
import { pickFecha, formatDateDisplay } from '@/shared/utils/dateUtils';

export const ListaMemorandumsPorArea = () => {
  const { memorandums, loading, error, recargar, idArea, nombreArea } = useListaMemorandumsPorArea();
  const navigate = useNavigate();

  const formatFecha = (obj, fallback) => formatDateDisplay(pickFecha(obj) || fallback);

  if (loading) {
    return (
      <div className="lista-memorandums-area-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando memorandums por área...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lista-memorandums-area-container">
        <div className="error-state">
          <p>Error al cargar: {error}</p>
          <button onClick={recargar} className="btn-reintentar">Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="lista-memorandums-area-container">
      <div className="lista-header">
        <h2>Memorandum asignados</h2>
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
          <table className="memorandums-area-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Folio Correspondencia</th>
                <th>Folio Memorandum</th>
                <th>Asunto</th>
                <th>Fecha Emisión</th>
                <th>Fecha Aceptación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {memorandums.map((memo, index) => (
                  <tr key={memo.idAcuse || index}>
                    <td className="num-index">{index + 1}</td>
                    <td>{memo.folioUnicoCorrespondencia || memo.folioUnico || '-'}</td>
                    <td className="num-memo">{memo.folioUnico || memo.numMemo || '-'}</td>
                    <td className="asunto-cell">
                      {memo.asuntoCorrespondencia || memo.asuntoCorrespondenciaCompleto || memo.observaciones || '-'}
                    </td>
                    <td>{formatFecha(memo, memo.fechaEmision)}</td>
                    <td>{formatFecha(memo, memo.fechaAceptacion)}</td>
                    <td>
                      <button 
                        className="btn-accion btn-contestacion"
                        title="Contestación"
                        onClick={() => navigate(`/correspondencia/contestacion/${memo.idAcuse}`)}
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
        <span>Total: {memorandums.length} memorandums</span>
      </div>
    </div>
  );
};