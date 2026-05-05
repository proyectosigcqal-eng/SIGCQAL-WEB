import { useCorrespondenciaPendientePorArea } from '../hooks/useCorrespondenciaPendientePorArea';
import '@/features/modulo-correspondencia/bandeja-central/styles/bandeja.css';

export const ListaCorrespondenciaPendiente = () => {
  const { correspondencia, loading, error, recargar, areaForzada } = useCorrespondenciaPendientePorArea();

  // Función para manejar el click (puedes adaptarla)
  const verDetalles = (item) => {
    console.log('Ver detalles de:', item);
    // Aquí puedes navegar, abrir modal, etc.
  };

  return (
    <div className="bandeja-wrapper">
      <div className="bandeja-header">
        <h1 className="bandeja-title">Correspondencia pendiente de revisión de área</h1>
        <p className="bandeja-subtitle">Documentos pendientes de revisión asignados al área forzada.</p>
      </div>

      <div className="bandeja-card">
        <div className="bandeja-content">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#a0aec0' }}>
              <p>Cargando correspondencia pendiente de revisión...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#c05621' }}>
              <p>Error al cargar correspondencia pendiente: {error}</p>
              <button className="btn-atender" onClick={recargar}>Reintentar</button>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#718096', fontWeight: 600 }}>Área forzada: {areaForzada}</span>
                <button className="btn-atender" onClick={recargar}>Actualizar</button>
              </div>

              <table className="bandeja-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Folio Único</th>
                    <th>Número de Oficio</th>
                    <th>Asunto</th>
                    <th>Acciones</th> {/* NUEVA COLUMNA */}
                  </tr>
                </thead>
                <tbody>
                  {correspondencia.length > 0 ? (
                    correspondencia.map((item, index) => (
                      <tr key={item.id || item.folioUnico || index}>
                        <td>{index + 1}</td>
                        <td>{item.folioUnico || item.folio || '-'}</td>
                        <td>{item.numeroOficio || item.nroOficio || item.oficio || '-'}</td>
                        <td>{item.asunto || item.descripcion || '-'}</td>
                        <td>
                          <button
                            className="btn-atender"
                            onClick={() => verDetalles(item)}
                          >
                            Ver detalles
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#a0aec0' }}>
                        No hay correspondencia pendiente en esta área.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
};