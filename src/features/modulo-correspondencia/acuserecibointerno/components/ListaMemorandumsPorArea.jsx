import { useListaMemorandumsPorArea } from '../hooks/useListaMemorandumsPorArea';
import '@/features/modulo-correspondencia/acuserecibointerno/styles/listaMemorandumsPorArea.css';

export const ListaMemorandumsPorArea = () => {
  const { memorandums, loading, error, recargar, areaForzada } = useListaMemorandumsPorArea();

  const formatearFecha = (fecha) => {
    if (!fecha) return '-';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const obtenerNombreUsuario = (idUsuario) => {
    // TODO: Integrar con catálogo de usuarios del sistema
    // Por ahora se retorna el ID como identificador temporal
    const usuariosMap = {
      1: 'Usuario 1',
      2: 'Usuario 2',
      3: 'Usuario 3'
    };
    return usuariosMap[idUsuario] || `Usuario ${idUsuario}`;
  };

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
          <table className="memorandums-area-table">
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
                <tr key={memo.idAcuse}>
                  <td className="num-index">{index + 1}</td>
                  <td>{memo.folioUnico || '-'}</td>
                  <td className="asunto-cell">{memo.observaciones || '-'}</td>
                  <td className="num-memo">{memo.numMemo || '-'}</td>
                  <td>{obtenerNombreUsuario(memo.idUsuarioEmisor)}</td>
                  <td>{formatearFecha(memo.fechaEmision)}</td>
                  <td>
                    <button 
                      className="btn-accion btn-contestacion"
                      title="Contestación"
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
