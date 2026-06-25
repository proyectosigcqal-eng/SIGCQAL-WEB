// features/modulo-area-sustantiva/representacion-legal-irl/components/TablaIrl.jsx

import { useNavigate } from "react-router-dom";
import { formatDateTimeDisplay } from "@/shared/utils/dateUtils";

/**
 * Tabla de Representación Legal IRL.
 *
 * Se usa standalone (BandejaIrlPage) y después se integra
 * dentro del tab "REPRESENTACION_LEGAL_IRL" de TablaTramites.jsx.
 */
export const TablaIrl = ({
  subSwitchActivo,
  setSubSwitchActivo,
  busqueda,
  setBusqueda,
  items,
  cargando,
  error,
  SUB_SWITCHES,
}) => {
  const navigate = useNavigate();

  const handleAtender = (id) => {
    navigate(`/atencion-juridica/representacion-legal-irl/atender/${id}`);
  };

  return (
    <div>
      {/* ── Sub-switches ── */}
      <div
        style={{
          display: "flex",
          gap: 0,
          marginBottom: "1.25rem",
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
              padding: "8px 20px",
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              whiteSpace: "nowrap",
              cursor: "pointer",
              borderRight:
                i < SUB_SWITCHES.length - 1
                  ? "0.5px solid var(--color-border-secondary)"
                  : "none",
              background:
                subSwitchActivo === sw.key
                  ? "#1e3a8a"
                  : "var(--color-background-primary)",
              color:
                subSwitchActivo === sw.key
                  ? "#fff"
                  : "var(--color-text-secondary)",
              transition: "background 0.12s, color 0.12s",
            }}
          >
            {sw.label}
          </button>
        ))}
      </div>

      {/* ── Búsqueda ── */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          className="bdg-input"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por Folio de Gobierno o Contribuyente..."
          aria-label="Buscar"
          style={{ width: "100%", maxWidth: 400 }}
        />
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
        /* ── Tabla ── */
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
