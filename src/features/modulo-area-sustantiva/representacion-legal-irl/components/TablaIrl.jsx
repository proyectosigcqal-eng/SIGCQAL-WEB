// features/modulo-area-sustantiva/representacion-legal-irl/components/TablaIrl.jsx

import { useNavigate } from "react-router-dom";
import { formatDateTimeDisplay } from "@/shared/utils/dateUtils";

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

export const TablaIrl = ({
  subSwitchActivo,
  setSubSwitchActivo,
  estatusActivo,
  setEstatusActivo,
  busqueda,
  setBusqueda,
  items,
  cargando,
  error,
  SUB_SWITCHES,
  ESTATUS_TABS,
}) => {
  const navigate = useNavigate();

  const handleAtender = (id) => {
    navigate(`/atencion-juridica/representacion-legal-irl/atender/${id}`);
  };

  return (
    <div>
      {/* ── Búsqueda (arriba de todo) ── */}
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

      {/* ── Tabs de estatus (con scroll horizontal) ── */}
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

      {/* ── Estado: cargando / error / vacío ── */}
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
              <th>FECHA / HORA</th>
              <th>ESTATUS</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id}>
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
                    {formatDateTimeDisplay(it.fechaCreacion) || "—"}
                  </div>
                </td>
                <td>
                  <span className="bdg-badge bdg-badge--estatus">
                    {it.estatus || "—"}
                  </span>
                </td>
                <td className="bdg-action-cell">
                  <button
                    className="bdg-btn-action"
                    onClick={() => handleAtender(it.id)}
                  >
                    ATENDER
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TablaIrl;
