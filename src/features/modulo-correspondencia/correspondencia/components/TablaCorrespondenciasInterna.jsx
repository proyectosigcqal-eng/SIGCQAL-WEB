import React, { useEffect, useMemo, useState } from "react";
import { formatDateTimeDisplay } from "@/shared/utils/dateUtils";
import { fileUrl } from "@/shared/config/api";
import { useCambiarTipoCorrespondencia } from "../hooks/useCambiarTipoCorrespondencia";

const PAGE_SIZE = 10;

const asArray = (value) => (Array.isArray(value) ? value : []);

const normalizeText = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const safeDateLabel = (value) => {
  if (!value) return "—";
  return formatDateTimeDisplay(value);
};

const getId = (item) =>
  item?.id ??
  item?.idCorrespondencia ??
  item?.correspondenciaId ??
  item?.id_correspondencia ??
  null;

const getIdEstatus = (item) => item?.idEstatus ?? item?.id_estatus ?? null;

const getEstatusLabel = (item) => {
  const raw = item?.idEstatus ?? item?.id_estatus;
  if (raw === 1 || raw === null || raw === undefined) return "Registrado";
  if (raw === 2) return "Asignado";
  if (raw === 3) return "En Seguimiento";
  if (raw === 4) return "Concluido";
  return String(raw);
};

const getEstatusColors = (label) => {
  const n = normalizeText(label);
  if (n.includes("registr")) return { bg: "#DBEAFE", fg: "#1D4ED8" };
  if (n.includes("asign")) return { bg: "#FEF3C7", fg: "#B45309" };
  if (n.includes("seguim")) return { bg: "#DCFCE7", fg: "#166534" };
  if (n.includes("conclu") || n.includes("cerrad") || n.includes("final"))
    return { bg: "#E5E7EB", fg: "#374151" };
  return { bg: "#E2E8F0", fg: "#0F172A" };
};

const buildEstatusOptions = (items) => {
  const map = new Map();
  asArray(items).forEach((it) => {
    const id = getIdEstatus(it);
    if (id === null || id === undefined || String(id).trim() === "") return;
    const key = String(id);
    if (map.has(key)) return;
    map.set(key, getEstatusLabel(it));
  });
  return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
};

export const TablaCorrespondenciasInterna = ({
  correspondencias = [],
  onGenerarOficio,
  loading,
  oficiosGuardados = {},
  archivosAdjuntos = {},
  onRefresh,
}) => {
  const [texto, setTexto] = useState("");
  const [filtroEstatus, setFiltroEstatus] = useState("");
  const [page, setPage] = useState(1);
  const { cambiarTipo, loading: loadingCambio } =
    useCambiarTipoCorrespondencia();

  const rows = useMemo(() => asArray(correspondencias), [correspondencias]);
  const estatusOptions = useMemo(() => buildEstatusOptions(rows), [rows]);

  const filtered = useMemo(() => {
    const q = normalizeText(texto);
    const estatus = String(filtroEstatus || "");

    return rows.filter((item) => {
      if (q) {
        const folio = normalizeText(
          item?.folioUnico ?? item?.folio_unico ?? "",
        );
        const asunto = normalizeText(item?.asunto ?? "");
        if (!folio.includes(q) && !asunto.includes(q)) return false;
      }

      if (estatus) {
        const idEstatus = getIdEstatus(item);
        if (String(idEstatus ?? "") !== estatus) return false;
      }

      return true;
    });
  }, [rows, texto, filtroEstatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  useEffect(() => {
    setPage(1);
  }, [texto, filtroEstatus]);

  const paged = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  );

  const handleClear = () => {
    setTexto("");
    setFiltroEstatus("");
    setPage(1);
  };

  const manejarCambiarTipo = async (id, idNuevoTipo) => {
    if (!window.confirm("¿Cambiar a Correspondencia Externa?")) return;
    try {
      await cambiarTipo(id, idNuevoTipo);
      alert("Tipo actualizado. Por favor, recarga la página.");
      onRefresh?.();
    } catch (error) {
      alert(
        `Error: ${error?.response?.data?.detail || error?.message || "Error al cambiar tipo"}`,
      );
    }
  };

  return (
    <div className="tabla-full-container">
      <div className="tabla-header-row">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          <h2 className="tabla-titulo">Correspondencia Registrada Interna</h2>
          <span
            style={{
              background: "#E2E8F0",
              color: "#0F172A",
              padding: "4px 10px",
              borderRadius: 999,
              fontSize: "0.8rem",
              fontWeight: 700,
            }}
          >
            {filtered.length} registros
          </span>
        </div>

        <button
          type="button"
          className="btn-secundario-corr"
          onClick={() => window.location.reload()}
          disabled={loading}
        >
          Actualizar lista
        </button>
      </div>

      <div className="tabla-toolbar">
        <input
          type="text"
          placeholder="Buscar por folio, asunto..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          disabled={loading}
          style={{
            padding: "7px 10px",
            border: "1px solid #cbd5e1",
            borderRadius: 6,
            fontSize: "0.85rem",
            minWidth: 240,
          }}
        />

        <select
          value={filtroEstatus}
          onChange={(e) => setFiltroEstatus(e.target.value)}
          disabled={loading}
          className="admin-view-select"
        >
          <option value="">Todos</option>
          {estatusOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="btn-secundario-corr"
          onClick={handleClear}
          disabled={loading}
        >
          Limpiar filtros
        </button>
      </div>

      {loading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "1rem 0",
            color: "#64748b",
          }}
        >
          <span className="spinner-corr" />
          <span style={{ fontWeight: 600 }}>Cargando correspondencias...</span>
        </div>
      ) : (
        <div className="tabla-scroll-wrapper">
          <table className="tabla-correspondencias-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Folio Único</th>
                <th>No. Oficio</th>
                <th>Asunto</th>
                <th>Fecha Recibido</th>
                <th>Estatus</th>
                <th>No. Oficio Salida</th>
                <th>Doc. Adjunto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: "1rem", color: "#64748b" }}>
                    No hay correspondencias con los filtros actuales.
                  </td>
                </tr>
              ) : (
                paged.map((item, idx) => {
                  const id = getId(item);
                  const folio = item?.folioUnico ?? item?.folio_unico ?? "—";
                  const oficio =
                    item?.numeroOficio ?? item?.num_oficio_externo ?? "—";
                  const asunto = item?.asunto ?? "—";
                  const fecha =
                    item?.fechaRecibido ?? item?.fecha_recibido ?? "—";
                  const fechaRecibido = safeDateLabel(fecha);
                  const estatusLabel = getEstatusLabel(item);
                  const badge = getEstatusColors(estatusLabel);
                  const oficioGuardado = id ? oficiosGuardados[id] : null;
                  const tieneOficio = oficioGuardado != null;
                  const numOficioSalida =
                    oficioGuardado?.numOficioSalida ?? null;
                  const urlPdfFinal = oficioGuardado?.urlPdfFinal ?? null;
                  const archivoAdjunto = id ? archivosAdjuntos[id] : null;

                  return (
                    <tr key={id ?? `${idx}`}>
                      <td style={{ whiteSpace: "nowrap" }}>
                        {(page - 1) * PAGE_SIZE + idx + 1}
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>{folio}</td>
                      <td style={{ whiteSpace: "nowrap" }}>{oficio}</td>
                      <td
                        title={asunto || ""}
                        style={{
                          maxWidth: 420,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {asunto}
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        {fechaRecibido || "—"}
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        <span
                          className="badge-estado"
                          style={{ background: badge.bg, color: badge.fg }}
                        >
                          {estatusLabel}
                        </span>
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        {numOficioSalida ? (
                          <span style={{ fontWeight: 600 }}>
                            {numOficioSalida}
                          </span>
                        ) : (
                          <span
                            style={{ color: "#9ca3af", fontStyle: "italic" }}
                          >
                            Pendiente
                          </span>
                        )}
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        {(() => {
                          if (urlPdfFinal) {
                            return (
                              <a
                                href={`http://localhost:8081/SIGCQAL_Prod${urlPdfFinal}`}
                                target="_blank"
                                rel="noreferrer"
                                className="btn-descargar-doc"
                                title="Descargar oficio de contestación"
                              >
                                ⬇ Oficio
                              </a>
                            );
                          }

                          const urlArchivo =
                            archivoAdjunto?.urlDescarga ??
                            archivoAdjunto?.rutaServidor ??
                            null;
                          if (
                            typeof urlArchivo === "string" &&
                            urlArchivo.trim()
                          ) {
                            const nombre =
                              archivoAdjunto?.nombreOriginal ?? "Documento";
                            const esRelativa = urlArchivo.startsWith("/");
                            const href = esRelativa
                              ? `http://localhost:8081/SIGCQAL_Prod${urlArchivo}`
                              : urlArchivo;
                            return (
                              <a
                                href={href}
                                target="_blank"
                                rel="noreferrer"
                                className="btn-descargar-doc"
                                title={`Descargar: ${nombre}`}
                              >
                                ⬇ Adjunto
                              </a>
                            );
                          }

                          return (
                            <span
                              style={{ color: "#9ca3af", fontStyle: "italic" }}
                            >
                              Sin documento
                            </span>
                          );
                        })()}
                        {urlPdfFinal ? (
                          <a
                            href={fileUrl(urlPdfFinal)}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-descargar-doc"
                          >
                            ⬇ Descargar
                          </a>
                        ) : (
                          <span
                            style={{ color: "#9ca3af", fontStyle: "italic" }}
                          >
                            Sin documento
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <div className="acciones-cell">
                          <button
                            type="button"
                            onClick={() => manejarCambiarTipo(id, 1)}
                            disabled={loadingCambio}
                            style={{
                              padding: "8px 12px",
                              backgroundColor: "#0066cc",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: loadingCambio ? "not-allowed" : "pointer",
                              fontSize: "13px",
                              fontWeight: "500",
                              width: '120px',
                              textAlign: 'center',
                              whiteSpace: 'nowrap',
                              opacity: loadingCambio ? 0.6 : 1,
                            }}
                          >
                            {loadingCambio
                              ? "Cambiando..."
                              : "Cambiar a Externa"}
                          </button>{" "}
                          {!tieneOficio ? (
                            <button
                              type="button"
                              className="btn-generar-oficio"
                              onClick={() => onGenerarOficio?.(item)}
                            >
                              Generar Oficio
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="tabla-paginacion">
        <div>
          Página {page} de {totalPages}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            className="btn-secundario-corr"
            disabled={loading || page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Anterior
          </button>
          <button
            type="button"
            className="btn-secundario-corr"
            disabled={loading || page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default TablaCorrespondenciasInterna;
