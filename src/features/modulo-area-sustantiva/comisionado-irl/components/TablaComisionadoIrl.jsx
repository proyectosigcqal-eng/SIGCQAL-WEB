// features/modulo-area-sustantiva/comisionado-irl/components/TablaComisionadoIrl.jsx

import { useState } from "react";
import { formatDateTimeDisplay } from "@/shared/utils/dateUtils";
import {
  formatearFecha,
  obtenerClaseSemaforo,
} from "../utils/semaforo";
import {
  formatearEventoBitacora,
  obtenerBitacora,
} from "../utils/bitacoraService";
import "./TablaComisionadoIrl.css";

const API_BASE =
  import.meta.env.VITE_API_URL ?? "http://localhost:8081/SIGCQAL_Prod";

const tabStyle = (active) => ({
  padding: "8px 20px",
  fontSize: 13,
  fontWeight: 600,
  border: "none",
  whiteSpace: "nowrap",
  cursor: "pointer",
  background: active ? "#1e3a8a" : "var(--color-background-primary)",
  color: active ? "#fff" : "var(--color-text-secondary)",
  transition: "background 0.12s, color 0.12s",
});

const estatusTabStyle = (active) => ({
  padding: "5px 14px",
  fontSize: 12,
  fontWeight: 500,
  border: "none",
  whiteSpace: "nowrap",
  cursor: "pointer",
  background: active ? "#1e40af" : "var(--color-background-primary)",
  color: active ? "#fff" : "var(--color-text-secondary)",
  transition: "background 0.12s, color 0.12s",
  flexShrink: 0,
});

export const TablaComisionadoIrl = ({
  subSwitchActivo,
  setSubSwitchActivo,
  estatusActivo,
  setEstatusActivo,
  asesorSeleccionado,
  setAsesorSeleccionado,
  asesores,
  busqueda,
  setBusqueda,
  items,
  cargando,
  error,
  SUB_SWITCHES,
  ESTATUS_TABS,
}) => {
  const [detalleAbierto, setDetalleAbierto] = useState(null);
  const [cargandoBitacora, setCargandoBitacora] = useState(false);

  const abrirDetalle = async (item) => {
    setDetalleAbierto({
      ...item,
      bitacora: [],
    });
    setCargandoBitacora(true);

    try {
      const bitacora = await obtenerBitacora(item.folioGobierno);
      const bitacoraFormato = Array.isArray(bitacora)
        ? bitacora.map((evt) => formatearEventoBitacora(evt))
        : [];

      setDetalleAbierto((prev) =>
        prev
          ? {
              ...prev,
              bitacora: bitacoraFormato,
            }
          : prev,
      );
    } catch (error) {
      console.error("Error cargando bitácora:", error);
      setDetalleAbierto((prev) =>
        prev
          ? {
              ...prev,
              bitacora: [],
            }
          : prev,
      );
    } finally {
      setCargandoBitacora(false);
    }
  };

  const descargarConstancia = (folio) => {
    window.open(
      `${API_BASE}/api/v1/expedientes/folio/${folio}/constancia-interna-remision/descargar`,
      "_blank",
    );
  };

  const renderSemaforo = (diasRestantes) => {
    if (diasRestantes === null || diasRestantes === undefined) {
      return <span className="bdg-sub">—</span>;
    }

    return (
      <div className="comisionado-irl-semaforo">
        <span className={obtenerClaseSemaforo(diasRestantes)}>●</span>
        <span className="comisionado-irl-semaforo-texto">
          {diasRestantes > 0 ? `${diasRestantes}d` : "Vencido"}
        </span>
      </div>
    );
  };

  return (
    <div>
      {/* ── Búsqueda ── */}
      <div style={{ marginBottom: "0.75rem" }}>
        <input
          className="bdg-input"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por Folio de Gobierno o Contribuyente..."
          aria-label="Buscar"
          style={{ width: "100%", maxWidth: 400 }}
        />
      </div>

      {/* ── Sub-switches (Directo / Evolución) ── */}
      <div
        style={{
          display: "flex",
          gap: 0,
          marginBottom: "0.75rem",
          borderRadius: 8,
          border: "0.5px solid var(--color-border-secondary)",
          overflow: "hidden",
          width: "fit-content",
        }}
      >
        {SUB_SWITCHES.map((sw, i) => (
          <button
            key={sw.key}
            type="button"
            onClick={() => setSubSwitchActivo(sw.key)}
            style={{
              ...tabStyle(subSwitchActivo === sw.key),
              borderRight:
                i < SUB_SWITCHES.length - 1
                  ? "0.5px solid var(--color-border-secondary)"
                  : "none",
            }}
          >
            {sw.label}
          </button>
        ))}
      </div>

      {/* ── Filtros: Asesor + Estatus (lado a lado) ── */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "0.75rem",
          flexWrap: "wrap",
        }}
      >
        {/* Filtro por asesor */}
        <select
          className="bdg-input"
          value={asesorSeleccionado ?? ""}
          onChange={(e) =>
            setAsesorSeleccionado(
              e.target.value ? Number(e.target.value) : null,
            )
          }
          style={{ width: "100%", maxWidth: 300 }}
        >
          <option value="">Todos los asesores</option>
          {asesores.map((a) => (
            <option key={a.idAsesor} value={a.idAsesor}>
              {a.nombreCompleto}
            </option>
          ))}
        </select>

        {/* Filtro por estatus */}
        <select
          className="bdg-input"
          value={estatusActivo ?? ""}
          onChange={(e) =>
            setEstatusActivo(
              e.target.value ? Number(e.target.value) : null,
            )
          }
          style={{ width: "100%", maxWidth: 300 }}
        >
          {ESTATUS_TABS.map((tab) => (
            <option key={tab.id ?? "todos"} value={tab.id ?? ""}>
              {tab.label}
            </option>
          ))}
        </select>
      </div>

      {/* ── Tabs de estatus (scroll horizontal) ── */}
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          marginBottom: "1rem",
          borderRadius: 6,
          border: "0.5px solid var(--color-border-secondary)",
        }}
      >
        {ESTATUS_TABS.map((tab) => (
          <button
            key={tab.id ?? "todos"}
            type="button"
            onClick={() => setEstatusActivo(tab.id)}
            style={{
              ...estatusTabStyle(estatusActivo === tab.id),
              borderRight: "0.5px solid var(--color-border-secondary)",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Estado ── */}
      {cargando ? (
        <div className="bdg-empty">
          <p>Cargando...</p>
        </div>
      ) : error ? (
        <div className="bdg-empty">
          <p style={{ color: "#b91c1c" }}>{error}</p>
        </div>
      ) : items.length === 0 ? (
        <div className="bdg-empty">
          <p>No se encontraron registros de Representación Legal IRL.</p>
        </div>
      ) : (
        <table className="bdg-table">
          <thead>
            <tr>
              <th>FOLIO DE GOBIERNO</th>
              <th>ASESOR</th>
              <th>CONTRIBUYENTE</th>
              <th>MUNICIPIO</th>
              <th>FECHA</th>
              <th>ESTATUS</th>
              <th>SEMÁFORO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr
                key={it.idRepresentacionLegal ?? it.id ?? it.folioGobierno}
              >
                <td>
                  <div className="bdg-folio">{it.folioGobierno}</div>
                </td>
                <td>
                  <div className="bdg-contribuyente">{it.asesor || "—"}</div>
                </td>
                <td>
                  <div className="bdg-contribuyente">
                    {it.contribuyente || "—"}
                  </div>
                </td>
                <td>
                  <div className="bdg-sub">{it.municipio || "—"}</div>
                </td>
                <td>
                  <div className="bdg-sub">
                    {formatearFecha(it.fechaCreacion)}
                  </div>
                </td>
                <td>
                  <span className="bdg-badge bdg-badge--estatus">
                    {it.estatus || "—"}
                  </span>
                </td>
                <td>{renderSemaforo(it.diasRestantes)}</td>
                <td className="bdg-action-cell">
                  <button
                    className="bdg-btn-action"
                    onClick={() => abrirDetalle(it)}
                  >
                    DETALLE
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ── Modal de Detalle (OVERLAY FIX) ── */}
      {detalleAbierto && (
        <>
          {/* Overlay oscuro */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.6)",
              zIndex: 9998,
              backdropFilter: "blur(2px)",
            }}
            onClick={() => setDetalleAbierto(null)}
          />

          {/* Modal contenedor */}
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#fff",
              borderRadius: 12,
              padding: "2rem",
              width: "90%",
              maxWidth: 700,
              maxHeight: "85vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.4)",
              zIndex: 9999,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
                paddingBottom: "1rem",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                Detalle — {detalleAbierto.folioGobierno}
              </h3>
              <button
                onClick={() => setDetalleAbierto(null)}
                style={{
                  background: "#f3f4f6",
                  border: "none",
                  fontSize: 28,
                  cursor: "pointer",
                  color: "#1f2937",
                  padding: "0",
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 6,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#e5e7eb";
                  e.target.style.color = "#111827";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#f3f4f6";
                  e.target.style.color = "#1f2937";
                }}
              >
                ✕
              </button>
            </div>

            {/* Grid de info (2 columnas) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#6b7280",
                    marginBottom: 6,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Contribuyente
                </div>
                <div style={{ fontWeight: 600, color: "#1f2937", fontSize: 14 }}>
                  {detalleAbierto.contribuyente || "—"}
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#6b7280",
                    marginBottom: 6,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Asesor
                </div>
                <div style={{ fontWeight: 600, color: "#1f2937", fontSize: 14 }}>
                  {detalleAbierto.asesor || "—"}
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#6b7280",
                    marginBottom: 6,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Municipio
                </div>
                <div style={{ fontWeight: 600, color: "#1f2937", fontSize: 14 }}>
                  {detalleAbierto.municipio || "—"}
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#6b7280",
                    marginBottom: 6,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Estatus
                </div>
                <span
                  style={{
                    display: "inline-block",
                    background: "#dbeafe",
                    color: "#1e40af",
                    padding: "5px 10px",
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {detalleAbierto.estatus || "—"}
                </span>
              </div>

              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#6b7280",
                    marginBottom: 6,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Fecha / Hora
                </div>
                <div style={{ fontWeight: 600, color: "#1f2937", fontSize: 14 }}>
                  {formatDateTimeDisplay(detalleAbierto.fechaCreacion) || "—"}
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#6b7280",
                    marginBottom: 6,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Tipo
                </div>
                <div style={{ fontWeight: 600, color: "#1f2937", fontSize: 14 }}>
                  {detalleAbierto.esEvolucion ? "Evolución" : "Asignación Directa"}
                </div>
              </div>
            </div>

            {/* Archivos Adjuntos */}
            <div
              style={{
                borderTop: "1px solid #e5e7eb",
                paddingTop: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <h4
                style={{
                  margin: "0 0 0.75rem 0",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#1f2937",
                }}
              >
                Archivos Adjuntos
              </h4>
              <div
                style={{
                  padding: "1rem",
                  background: "#f9fafb",
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  textAlign: "center",
                  color: "#6b7280",
                  fontSize: 12,
                }}
              >
                No hay adjuntos registrados.
              </div>
            </div>

            {/* Bitácora / Ciclo de Vida */}
            <div
              style={{
                borderTop: "1px solid #e5e7eb",
                paddingTop: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <h4
                style={{
                  margin: "0 0 0.75rem 0",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#1f2937",
                }}
              >
                Bitácora / Ciclo de Vida
              </h4>

              {cargandoBitacora ? (
                <div
                  style={{
                    padding: "1rem",
                    background: "#f9fafb",
                    borderRadius: 6,
                    border: "1px solid #e5e7eb",
                    textAlign: "center",
                    color: "#6b7280",
                    fontSize: 12,
                  }}
                >
                  Cargando bitácora...
                </div>
              ) : detalleAbierto.bitacora && detalleAbierto.bitacora.length > 0 ? (
                <div
                  style={{
                    maxHeight: 320,
                    overflowY: "auto",
                    borderLeft: "3px solid #1e40af",
                    paddingLeft: "1rem",
                    marginLeft: "0rem",
                  }}
                >
                  {detalleAbierto.bitacora.map((evt, idx) => (
                    <div
                      key={idx}
                      style={{
                        marginBottom: "1rem",
                        paddingBottom: "1rem",
                        borderBottom:
                          idx < detalleAbierto.bitacora.length - 1
                            ? "1px dashed #e5e7eb"
                            : "none",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#1f2937",
                        }}
                      >
                        {evt.tipoLabel || evt.tipo || "Evento"}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "#6b7280",
                          marginTop: 4,
                          lineHeight: "1.4",
                        }}
                      >
                        {evt.fechaFormato}
                        {evt.descripcion ? ` — ${evt.descripcion}` : ""}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    padding: "1rem",
                    background: "#f9fafb",
                    borderRadius: 6,
                    border: "1px solid #e5e7eb",
                    textAlign: "center",
                    color: "#6b7280",
                    fontSize: 12,
                  }}
                >
                  No hay eventos registrados en la bitácora.
                </div>
              )}
            </div>

            {/* Botones */}
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "flex-end",
                borderTop: "1px solid #e5e7eb",
                paddingTop: "1.5rem",
              }}
            >
              {detalleAbierto.folioGobierno && (
                <button
                  style={{
                    background: "#fff",
                    color: "#1f2937",
                    border: "1px solid #d1d5db",
                    padding: "10px 16px",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 600,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#f9fafb";
                    e.target.style.borderColor = "#9ca3af";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "#fff";
                    e.target.style.borderColor = "#d1d5db";
                  }}
                  onClick={() => descargarConstancia(detalleAbierto.folioGobierno)}
                >
                  DESCARGAR CIR
                </button>
              )}

              <button
                style={{
                  background: "#1e40af",
                  color: "#fff",
                  border: "none",
                  padding: "10px 24px",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#1e3a8a")}
                onMouseLeave={(e) => (e.target.style.background = "#1e40af")}
                onClick={() => setDetalleAbierto(null)}
              >
                CERRAR
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TablaComisionadoIrl;
