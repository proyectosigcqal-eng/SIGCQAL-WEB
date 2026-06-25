// features/modulo-area-sustantiva/atencion-juridica/bandeja/components/TablaTramites.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SemaforoContador } from "@/features/modulo-area-sustantiva/atencion-juridica/prevencion/components/SemaforoPlazo";
import { SemaforoPlazosAutoridad } from "@/features/modulo-area-sustantiva/atencion-juridica/plazo-autoridad/components/SemaforoPlazosAutoridad";
import { useBandejaIrl } from "@/features/modulo-area-sustantiva/representacion-legal-irl/hooks/useBandejaIrl";
import { TablaIrl } from "@/features/modulo-area-sustantiva/representacion-legal-irl/components/TablaIrl";

const API_BASE =
  import.meta.env.VITE_API_URL ?? "http://localhost:8081/SIGCQAL_dev";

const TIPO_TRAMITE_TABS = [
  { id: "ASESORIA_SIMPLIFICADA", label: "Asesoría Simplificada" },
  { id: "QUEJAS_RECLAMACIONES", label: "Quejas y Reclamaciones" },
  { id: "REPRESENTACION_LEGAL_IRL", label: "Representación Legal IRL" },
];

const BadgeEstatus = ({ label, bloqueado }) => (
  <span
    className={`bdg-badge ${bloqueado ? "bdg-badge--bloqueado" : "bdg-badge--estatus"}`}
  >
    {label || "—"}
  </span>
);

// Devuelve SIEMPRE un arreglo: [{ tipo: 'navegacion'|'descarga', label, ruta? , url? }]
const calcularAcciones = (t, estUp) => {
  if (estUp.includes("ASIGNADA A ASESOR")) {
    if (t.checklistCompleto) {
      return [
        {
          tipo: "navegacion",
          label: "GENERAR CIR",
          ruta: `/atencion-juridica/constancia-interna-remision/${t.folio}`,
        },
      ];
    }
    return [
      {
        tipo: "navegacion",
        label: "ATENDER",
        ruta: `/atencion-juridica/checklist/${t.folio}`,
      },
    ];
  }

  if (estUp.includes("VALIDACIÓN") || estUp.includes("VALIDACION")) {
    return [
      {
        tipo: "navegacion",
        label: "VALIDAR DOCS",
        ruta: `/atencion-juridica/checklist/${t.folio}`,
      },
    ];
  }

  if (estUp.includes("CIR")) {
    return [
      {
        tipo: "descarga",
        label: "DESCARGAR CIR",
        url: `${API_BASE}/api/v1/expedientes/folio/${t.folio}/constancia-interna-remision/descargar`,
      },
      t.tieneAri
        ? {
            tipo: "navegacion",
            label: "VER ARI",
            ruta: `/area-sustantiva/quejas-ari/${t.folio}`,
          }
        : {
            tipo: "navegacion",
            label: "GENERAR ARI",
            ruta: `/area-sustantiva/quejas-ari/${t.folio}`,
          },
    ];
  }

  if (estUp.includes("ARI")) {
    return [
      t.tieneOficio
        ? {
            tipo: "navegacion",
            label: "VER OFICIO",
            ruta: `/atencion-juridica/oficio-notificacion/${t.folio}`,
          }
        : {
            tipo: "navegacion",
            label: "GENERAR OFICIO",
            ruta: `/atencion-juridica/oficio-notificacion/${t.folio}`,
          },
    ];
  }

  if (estUp.includes("OFICIO")) {
    return [
      t.tieneContestacion
        ? {
            tipo: "navegacion",
            label: "VER CONTESTACIÓN",
            ruta: `/atencion-juridica/contestacion-autoridad/${t.folio}`,
          }
        : {
            tipo: "navegacion",
            label: "REGISTRAR CONTESTACIÓN",
            ruta: `/atencion-juridica/contestacion-autoridad/${t.folio}`,
          },
    ];
  }

  if (estUp.includes("CONTESTACIÓN") || estUp.includes("CONTESTACION")) {
    return [
      {
        tipo: "navegacion",
        label: "ATENDER",
        ruta: `/atencion-juridica/contestacion-autoridad/${t.folio}`,
      },
    ];
  }

  if (estUp.includes("ACCI")) {
    return [
      t.tieneResolucion
        ? {
            tipo: "navegacion",
            label: "VER RESOLUCIÓN",
            ruta: `/atencion-juridica/resolucion-final/${t.folio}`,
          }
        : {
            tipo: "navegacion",
            label: "GENERAR RESOLUCIÓN",
            ruta: `/atencion-juridica/resolucion-final/${t.folio}`,
          },
    ];
  }

  if (estUp.includes("RESOLUCIÓN") || estUp.includes("RESOLUCION")) {
    return [
      {
        tipo: "navegacion",
        label: "NOTIFICAR",
        ruta: `/area-sustantiva/cierre-test/${t.folio}`,
      },
    ];
  }

  if (
    estUp.includes("NOTIFICACIÓN FINAL") ||
    estUp.includes("NOTIFICACION FINAL")
  ) {
    return [
      {
        tipo: "navegacion",
        label: "CERRAR EXPEDIENTE",
        ruta: `/area-sustantiva/cierre-test/${t.folio}`,
      },
    ];
  }

  return [
    {
      tipo: "navegacion",
      label: "ATENDER",
      ruta: `/atencion-juridica/checklist/${t.folio}`,
    },
  ];
};

export const TablaTramites = ({ tramites }) => {
  const navigate = useNavigate();
  const [tipoActivo, setTipoActivo] = useState("QUEJAS_RECLAMACIONES");

  // Hook IRL — solo hace fetch cuando el tab IRL esté activo
  const isIrlActivo = tipoActivo === "REPRESENTACION_LEGAL_IRL";
  const {
    busqueda: irlBusqueda,
    setBusqueda: setIrlBusqueda,
    subSwitchActivo,
    setSubSwitchActivo,
    items: irlItems,
    cargando: irlCargando,
    error: irlError,
    SUB_SWITCHES,
  } = useBandejaIrl({ enabled: isIrlActivo });

  const tramitesFiltrados =
    tipoActivo === "QUEJAS_RECLAMACIONES" ? (tramites ?? []) : [];

  return (
    <div>
      {/* ── Switch triple ── */}
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
        {TIPO_TRAMITE_TABS.map((tab, i) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTipoActivo(tab.id)}
            style={{
              padding: "8px 20px",
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              whiteSpace: "nowrap",
              cursor: "pointer",
              borderRight:
                i < TIPO_TRAMITE_TABS.length - 1
                  ? "0.5px solid var(--color-border-secondary)"
                  : "none",
              background:
                tipoActivo === tab.id
                  ? "#1e3a8a"
                  : "var(--color-background-primary)",
              color:
                tipoActivo === tab.id ? "#fff" : "var(--color-text-secondary)",
              transition: "background 0.12s, color 0.12s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab IRL: Renderiza TablaIrl con sus sub-switches ── */}
      {isIrlActivo ? (
        <TablaIrl
          subSwitchActivo={subSwitchActivo}
          setSubSwitchActivo={setSubSwitchActivo}
          busqueda={irlBusqueda}
          setBusqueda={setIrlBusqueda}
          items={irlItems}
          cargando={irlCargando}
          error={irlError}
          SUB_SWITCHES={SUB_SWITCHES}
        />
      ) : /* ── Tab Quejas: lógica existente sin cambios ── */
      tramitesFiltrados.length === 0 ? (
        <div className="bdg-empty">
          <p>No se encontraron trámites con los filtros seleccionados.</p>
        </div>
      ) : (
        <table className="bdg-table">
          <thead>
            <tr>
              <th>FOLIO ASESORÍA</th>
              <th>EXPEDIENTE QUEJA</th>
              <th>QUEJOSO</th>
              <th>ASUNTO</th>
              <th>ESTATUS</th>
              <th>SEMÁFORO/CONTADOR</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {tramitesFiltrados.map((t) => {
              const bloqueado = t.bloqueado === true;
              const estUp = (t.estatus ?? "").toUpperCase();
              const acciones = calcularAcciones(t, estUp);

              return (
                <tr
                  key={t.id}
                  className={bloqueado ? "bdg-row--bloqueado" : ""}
                >
                  <td>
                    <div className="bdg-folio">{t.folio}</div>
                    <div className="bdg-sub">{t.municipio}</div>
                  </td>
                  <td>
                    <div className="bdg-folio">{t.folio}</div>
                  </td>
                  <td>
                    <div className="bdg-contribuyente">{t.contribuyente}</div>
                  </td>
                  <td>
                    <div className="bdg-asunto">{t.asunto}</div>
                  </td>
                  <td>
                    <BadgeEstatus label={t.estatus} bloqueado={bloqueado} />
                  </td>
                  <td>
                    {estUp.includes("ASIGNADA A ASESOR") ||
                    estUp.includes("VALIDACIÓN") ||
                    estUp.includes("VALIDACION") ? (
                      <SemaforoContador folio={t.folio} />
                    ) : (
                      <span style={{ color: "#999", fontSize: "0.8rem" }}>
                        —
                      </span>
                    )}
                  </td>
                  <td className="bdg-action-cell">
                    {bloqueado ? (
                      <button
                        className="bdg-btn-action bdg-btn-action--disabled"
                        disabled
                      >
                        CERRADO
                      </button>
                    ) : (
                      acciones.map((accion, i) =>
                        accion.tipo === "descarga" ? (
                          <a
                            key={i}
                            className="bdg-btn-action bdg-btn-action--secundario"
                            href={accion.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {accion.label}
                          </a>
                        ) : (
                          <button
                            key={i}
                            className="bdg-btn-action"
                            onClick={() => navigate(accion.ruta)}
                          >
                            {accion.label}
                          </button>
                        ),
                      )
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};
