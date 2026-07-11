import { useNavigate } from "react-router-dom";
import { useListaAcusesCorrespondenciaPorArea } from "../hooks/useListaAcusesCorrespondenciaPorArea";
import "@/features/modulo-correspondencia/acusecorrespondencia/styles/listaAcusesCorrespondencia.css";
import { pickFecha, formatDateDisplay } from "@/shared/utils/dateUtils";

// DESPUÉS
export const ListaAcusesCorrespondenciaPorArea = () => {
  const {
    acuses,
    loading,
    error,
    recargar,
    areaForzada,
    limpiarContestados,
    mostrarTodos,
    ocultarContestados,
  } = useListaAcusesCorrespondenciaPorArea();
  const navigate = useNavigate();

  const formatFecha = (obj, fallback) =>
    formatDateDisplay(pickFecha(obj) || fallback);

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
          <button onClick={recargar} className="btn-reintentar">
            Reintentar
          </button>
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
          {!ocultarContestados ? (
            <button
              onClick={limpiarContestados}
              className="btn-limpiar-acuse"
              title="Ocultar los oficios ya contestados"
            >
              🗹 Limpiar
            </button>
          ) : (
            <button
              onClick={mostrarTodos}
              className="btn-limpiar-acuse"
              title="Mostrar todos"
            >
              👁 Mostrar todos
            </button>
          )}
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
                  <td>{acuse.folioUnico || "-"}</td>
                  <td>{acuse.dependenciaRemitente || "-"}</td>
                  <td>{acuse.asunto || "-"}</td>
                  <td>{formatFecha(acuse, acuse.fechaExpedicion)}</td>
                  <td>{formatFecha(acuse, acuse.fechaAceptacion)}</td>
                  <td>
                    <button
                      className={`btn-contestacion-acuse-correspondencia ${acuse.idEstatus >= 5 ? "btn-contestacion-disabled" : ""}`}
                      disabled={acuse.idEstatus >= 5}
                      title={
                        acuse.idEstatus >= 5
                          ? "Ya fue contestado"
                          : "Ir a contestación"
                      }
                      onClick={() => {
                        const idDestino = acuse.idCorrespondencia;
                        if (idDestino) {
                          navigate(
                            `/correspondencia/contestacion-correspondencia/${idDestino}`,
                          );
                        } else {
                          console.error(
                            "No se encontró idCorrespondencia en el acuse:",
                            acuse,
                          );
                        }
                      }}
                    >
                      {acuse.idEstatus >= 5 ? "Contestado" : "Contestación"}
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
