// features/modulo-area-sustantiva/representacion-legal-irl/components/TablaIrl.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatearFecha, obtenerColorSemaforo } from "../../../modulo-area-sustantiva/comisionado-irl/utils/semaforo";   // ya existe en TablaComisionadoIrl
import { SemaforoJudicial } from "@/features/modulo-area-sustantiva/demanda-amparo/components/SemaforoJudicial";
import { cerrarExpediente } from "@/features/modulo-area-sustantiva/notificacion-cierre-y-acuerdo-de-razon/services/cierreService";

const tabStyle = (active) => ({
  padding: "8px 20px",
  fontSize: 13,
  fontWeight: 600,
  border: "none",
  whiteSpace: "nowrap",
  cursor: "pointer",
  background: active ? "#1e3a8a" : "var(--color-background-primary)",
  color:      active ? "#fff"    : "var(--color-text-secondary)",
  transition: "background 0.12s, color 0.12s",
});

// ── Misma lógica que calcularAcciones en TablaTramites, pero para flujo IRL ──
// id = idRepresentacionLegal (identificador del caso IRL)
// ⚠️ Ajusta las rutas cuando conectes los formularios al router
// ✅ Usa los flags reales que devuelve el backend + estatus del catálogo
const calcularAccionesIrl = (item, estUp) => {
  const folio = item.folioGobierno ?? item.folio ?? item.idExpediente ?? item.id;

  // ⚠️ CIR tiene 2 rutas posibles (rl-cir / queja-rl-cir) — decisión de flujo pendiente.
  // Por ahora apunta a rl-cir; cuando se defina cómo distinguir el tipo en el item, ajusta aquí.
  if (!estUp || estUp.includes('ASIGNADO')) {
    return [{ tipo: 'navegacion', label: 'REGISTRAR CIR',
              ruta: `/area-sustantiva/rl-cir/${folio}` }];
  }

  // Si el estatus ya es CIR, el flujo CIR está completo → siguiente paso es la demanda
  if (estUp.includes('CIR')) {
    return [{
      tipo: 'navegacion',
      label: item.tieneDemanda ? 'VER DEMANDA' : 'REGISTRAR DEMANDA',
      ruta: `/atencion-juridica/demanda-amparo/${folio}`,
    }];
  }

  if (estUp.includes('DEMANDA')) {
    return [{ tipo: 'navegacion', label: 'REGISTRAR AUDIENCIA',
              ruta: `/sustantiva/audiencia-espera` }];
  }

  if (estUp.includes('ESPERA')) {
    return [{
      tipo: 'navegacion',
      label: item.tieneAudiencia ? 'VER AUDIENCIA' : 'REGISTRAR AUDIENCIA',
      ruta: `/sustantiva/audiencia-celebrada`,
    }];
  }

  if (estUp.includes('CELEBRADA')) {
    return [{
      tipo: 'navegacion',
      label: item.tieneSentencia ? 'VER SENTENCIA' : 'REGISTRAR SENTENCIA',
      ruta: `/sustantiva/sentencia-dictada`,
    }];
  }

  if (estUp.includes('DICTADA')) {
    return [
      { tipo: 'navegacion', label: 'RECURSO REVISIÓN',
        ruta: `/sustantiva/recurso-revision` },
      {
        tipo: 'navegacion',
        label: item.tieneEjecutoria ? 'VER EJECUTORIA' : 'SENTENCIA EJECUTORIA',
        ruta: `/sustantiva/sentencia-ejecutoria`,
      },
    ];
  }

  if (estUp.includes('REVISIÓN') || estUp.includes('REVISION')) {
    return [{
      tipo: 'navegacion',
      label: item.tieneEjecutoria ? 'VER EJECUTORIA' : 'REGISTRAR EJECUTORIA',
      ruta: `/sustantiva/sentencia-ejecutoria`,
    }];
  }

  if (estUp.includes('EJECUTORIA')) {
    return [{
      tipo: 'navegacion',
      label: item.tieneCumplimiento ? 'VER NOTIFICACIÓN' : 'NOTIFICAR CUMPLIMIENTO',
      ruta: `/sustantiva/notificacion-sentencia`,
    }];
  }

  if (estUp.includes('CUMPLIMIENTO')) {
    return [{ tipo: 'tab', label: 'PASAR A CONCLUIDO', tab: 'CONCLUIDO' }];
  }

  if (estUp.includes('CONCLUIDO')) {
    return [{ tipo: 'info', label: 'CONCLUIDO', ruta: null }];
  }

  return [{ tipo: 'navegacion', label: 'ATENDER',
            ruta: `/atencion-juridica/demanda-amparo/${folio}` }];
};
export const TablaIrl = ({
  subSwitchActivo,
  setSubSwitchActivo,
  etapaActiva,
  setEtapaActiva,
  estatusActivo,      // ← alias de etapaActiva para compatibilidad
  setEstatusActivo,   // ← alias
  busqueda,
  setBusqueda,
  items,
  cargando,
  error,
  SUB_SWITCHES,
  ESTATUS_TABS,       // = ETAPAS_IRL
  recargar,
}) => {
  const navigate = useNavigate();
  const [procesandoConcluir, setProcesandoConcluir] = useState(false);
  const [semaforos, setSemaforos] = useState({});
  const [semaforoCargando, setSemaforoCargando] = useState(false);
  const [detalleModal, setDetalleModal] = useState(null);
  const [detalleTipo, setDetalleTipo] = useState(null);

  const descargarDesdeUrl = async (url, filenameFallback) => {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        window.alert('No fue posible descargar el archivo (no existe en el servidor).');
        return;
      }
      const blob = await res.blob();
      const disposition = res.headers.get('content-disposition') || '';
      let filename = filenameFallback || 'documento.docx';
      const m = disposition.match(/filename="?([^";]+)"?/);
      if (m && m[1]) filename = m[1];
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      console.error('Error descargando archivo:', e);
      window.alert('Error al descargar el archivo. Revisa la consola para más detalles.');
    }
  };

  const getDemandaId = (item) =>
    item?.idDemandaAmparo ?? item?.idDemanda ?? item?.idExpediente ?? item?.id;

  const getFechaRegistro = (item) =>
    item?.fechaRegistro ?? item?.fechaDemanda ?? item?.fechaCreacion ?? item?.fecha_registro ?? item?.fecha_demanda ?? item?.fecha_creacion ?? null;

  const calcularFechaLimite = (fechaRegistro) => {
    if (!fechaRegistro) return null;
    const fecha = new Date(fechaRegistro);
    if (Number.isNaN(fecha.getTime())) return null;

    let diasHabiles = 15;
    let actual = new Date(fecha);
    actual.setDate(actual.getDate() + 1); // iniciar el día siguiente

    while (diasHabiles > 0) {
      const diaSemana = actual.getDay();
      if (diaSemana !== 0 && diaSemana !== 6) {
        diasHabiles -= 1;
      }
      if (diasHabiles > 0) {
        actual.setDate(actual.getDate() + 1);
      }
    }

    return actual.toISOString().slice(0, 10);
  };

  const contarDiasHabilesEntre = (inicio, fin) => {
    const s = new Date(inicio);
    const e = new Date(fin);
    s.setHours(0,0,0,0);
    e.setHours(0,0,0,0);
    if (s > e) return 0;
    let cuenta = 0;
    let actual = new Date(s);
    while (actual <= e) {
      const dia = actual.getDay();
      if (dia !== 0 && dia !== 6) cuenta += 1;
      actual.setDate(actual.getDate() + 1);
    }
    return cuenta;
  };

  const obtenerSemaforoLocal = (item) => {
    const fechaRegistro = getFechaRegistro(item);
    const fechaLimite = calcularFechaLimite(fechaRegistro);
    if (!fechaLimite) return null;

    const hoy = new Date();
    const inicioCuenta = new Date(hoy);
    inicioCuenta.setDate(inicioCuenta.getDate() + 1); // contar desde el día siguiente
    inicioCuenta.setHours(0,0,0,0);

    const diasHabilesRestantes = contarDiasHabilesEntre(inicioCuenta, new Date(fechaLimite));
    const color = obtenerColorSemaforo(diasHabilesRestantes);

    const limite = new Date(fechaLimite);
    limite.setHours(23,59,59,999);

    return {
      color,
      diasHabilesRestantes,
      fechaLimite,
      vencido: diasHabilesRestantes === 0 && hoy > limite,
    };
  };

  // Compatibilidad: si el padre pasa etapaActiva la usamos, si no usamos estatusActivo
  const etapaActual    = etapaActiva ?? estatusActivo ?? "TODAS";
  const setEtapaActual = setEtapaActiva ?? setEstatusActivo ?? (() => {});

  const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_dev';

  // Cargar semáforos solo cuando estamos en la pestaña DEMANDA_PRESENTADA
  useEffect(() => {
    let mounted = true;
    const demandaKeys = (items || []).map(it => ({
      id: getDemandaId(it),
      fechaRegistro: it.fechaRegistro ?? it.fechaDemanda ?? it.fechaCreacion,
    }));

    const ids = demandaKeys.map(d => d.id).filter(Boolean);
    if (etapaActual !== 'DEMANDA_PRESENTADA' || (ids.length === 0 && demandaKeys.every(d => !d.fechaRegistro))) {
      setSemaforos({});
      return;
    }

    setSemaforoCargando(true);
    Promise.all(
      demandaKeys.map(d => {
        if (!d.id) return Promise.resolve(null);
        return fetch(`${API}/api/v1/irl-demanda-amparo/${d.id}/semaforo-judicial`)
          .then(r => r.ok ? r.json() : null)
          .catch(() => null);
      })
    )
    .then(results => {
      if (!mounted) return;
      const map = {};
      demandaKeys.forEach((d, i) => {
        if (d.id) map[d.id] = results[i];
      });
      setSemaforos(map);
    })
    .finally(() => { if (mounted) setSemaforoCargando(false); });

    return () => { mounted = false; };
  }, [items, etapaActual]);

  return (
    <div>
      {/* ── Búsqueda ── */}
      <div style={{ marginBottom: "0.75rem" }}>
        <input
          className="bdg-input"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por folio o contribuyente..."
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

      {/* ── Tabs de etapa (scroll horizontal, igual que QUEJAS) ── */}
<div
  className="bdg-etapas-scroll"  
  style={{
    display: "flex",
    overflowX: "auto",
    marginBottom: "1rem",
    borderRadius: 6,
    border: "0.5px solid var(--color-border-secondary)",
  }}
>
        
        {(ESTATUS_TABS ?? []).map((tab, i) => (
          <button
            key={tab.key ?? tab.id ?? "todos"}
            type="button"
            onClick={() => setEtapaActual(tab.key ?? tab.id ?? "TODAS")}
            style={{
              ...tabStyle(etapaActual === (tab.key ?? tab.id ?? "TODAS")),
              borderRight: "0.5px solid var(--color-border-secondary)",
              flexShrink: 0,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Estado: cargando / error / vacío / tabla ── */}
      {cargando ? (
        <div className="bdg-empty"><p>Cargando...</p></div>
      ) : error ? (
        <div className="bdg-empty"><p style={{ color: "#b91c1c" }}>{error}</p></div>
      ) : items.length === 0 ? (
        <div className="bdg-empty">
          <div className="bdg-empty-icon">📂</div>
          <p>No se encontraron trámites de Representación Legal IRL.</p>
        </div>
      ) : (
        <div className="bdg-table-responsive">
          <table className="bdg-table">
            <thead>
              <tr>
                <th>FOLIO DE GOBIERNO</th>
                <th>CONTRIBUYENTE</th>
                <th>MUNICIPIO</th>
                <th>FECHA REGISTRO</th>
                {etapaActual === 'DEMANDA_PRESENTADA' && <th>SEMÁFORO</th>}
                <th>ESTATUS</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                const estUp   = (item.estatus ?? "").toUpperCase();
                const acciones = calcularAccionesIrl(item, estUp);
                const demandaId = getDemandaId(item);

                // Añadir botón de descarga de la demanda si existe id de demanda o flag
                if (demandaId || item.tieneDemanda) {
                  acciones.push({
                    tipo: 'descarga',
                    label: 'DESCARGAR DEMANDA',
                    url: `${API}/api/v1/irl-demanda-amparo/${demandaId || item.idDemandaAmparo}/descargar`,
                  });
                }

                // Si no hay documento para audiencia o sentencia, ofrecer modal de visualización
                if (item.tieneAudiencia) {
                  acciones.push({ tipo: 'modal', modalType: 'AUDIENCIA', label: 'VER AUDIENCIA' });
                }
                if (item.tieneSentencia) {
                  acciones.push({ tipo: 'modal', modalType: 'SENTENCIA', label: 'VER SENTENCIA' });
                }

                const rowKey = item.idRepresentacionLegal ?? item.id ?? item.idExpediente ?? item.folioGobierno ?? item.folio ?? `irl-row-${index}`;

                return (
                  <tr key={rowKey}>
                    <td>
                      <div className="bdg-folio">{item.folioGobierno || "—"}</div>
                    </td>
                    <td>
                      <div className="bdg-contribuyente">{item.contribuyente || "—"}</div>
                    </td>
                    <td>
                      <div className="bdg-sub">{item.municipio || "—"}</div>
                    </td>
                    <td>
                      <div className="bdg-sub">{formatearFecha(item.fechaRegistro ?? item.fechaCreacion)}</div>
                    </td>
                    {etapaActual === 'DEMANDA_PRESENTADA' && (
                      <td>
                        {(() => {
                          const demandaId = getDemandaId(item);
                          if (!demandaId) return <span className="semaforo-na">—</span>;
                          if (semaforoCargando && !semaforos[demandaId]) {
                            return <span className="semaforo-cargando">Calculando...</span>;
                          }
                          const semaforo = semaforos[demandaId] || obtenerSemaforoLocal(item);
                          return semaforo
                            ? <SemaforoJudicial semaforo={semaforo} />
                            : <span className="semaforo-na">—</span>;
                        })()}
                      </td>
                    )}
                    <td>
                      <span className="bdg-badge bdg-badge--estatus">
                        {item.estatus || "—"}
                      </span>
                    </td>
                    <td className="bdg-action-cell">
                      {acciones.map((accion, i) => {
                        if (accion.tipo === "info") {
                          return (
                            <span
                              key={i}
                              className="bdg-btn-action bdg-btn-action--disabled"
                              style={{ cursor: "default" }}
                            >
                              {accion.label}
                            </span>
                          );
                        }


                        if (accion.tipo === "descarga") {
                          return (
                            <button
                              key={i}
                              className="bdg-btn-action bdg-btn-action--secundario"
                              onClick={() => descargarDesdeUrl(accion.url, `${item.folioGobierno || item.folio || 'demanda'}-demanda.docx`)}
                            >
                              <span className="bdg-btn-icon">📥</span>
                              {accion.label}
                            </button>
                          );
                        }

                        if (accion.tipo === "modal") {
                          return (
                            <button
                              key={i}
                              className="bdg-btn-action"
                              onClick={() => { setDetalleModal(item); setDetalleTipo(accion.modalType); }}
                            >
                              {accion.label}
                            </button>
                          );
                        }


                        if (accion.tipo === "tab") {
                          // Acciones de pestaña → en particular 'CONCLUIDO' necesita cerrar expediente en backend
                          return (
                            <button
                              key={i}
                              className="bdg-btn-action"
                              onClick={async () => {
                                if ((accion.tab ?? "").toUpperCase() === "CONCLUIDO") {
                                  // Llamada al servicio de cierre y luego cambio de pestaña
                                  if (procesandoConcluir) return;
                                  setProcesandoConcluir(true);
                                  try {
                                    const idExp = Number(item.idExpediente ?? item.id ?? item.folio);
                                    if (!Number.isFinite(idExp) || idExp <= 0) {
                                      // intenta usar folio como fallback; el backend podría resolverlo
                                      console.warn('idExpediente no válido, usando folio como fallback');
                                    }

                                    const rawUser = localStorage.getItem('user') || localStorage.getItem('usuario');
                                    let userId = 12;
                                    if (rawUser) {
                                      try { userId = JSON.parse(rawUser).id || JSON.parse(rawUser).idUsuario || JSON.parse(rawUser).usuarioId || userId; } catch { /* ignore */ }
                                    }

                                    const folioVal = item.folioGobierno ?? item.folio ?? idExp;
                                    const payload = {
                                      idExpediente: Number(idExp) || null,
                                      medioNotificacion: 'CORREO ELECTRONICO',
                                      rutaArchivoAcuerdo: `/almacen/acuerdos/EXPEDIENTE_${folioVal}.pdf`,
                                      idUsuarioCierre: Number(userId),
                                    };

                                    console.log('Payload cierre expediente:', payload);
                                    await cerrarExpediente(payload);
                                    // Cambia a la pestaña CONCLUIDO en la UI
                                    setEtapaActual('CONCLUIDO');
                                    // Refresca la bandeja si el padre proporcionó recargar
                                    if (typeof recargar === 'function') {
                                      try { await recargar(); } catch (e) { console.warn('Recargar falló', e); }
                                    }
                                  } catch (e) {
                                    console.error('Error al pasar a concluido:', e);
                                    window.alert('No fue posible concluir el expediente. Intenta de nuevo.');
                                  } finally {
                                    setProcesandoConcluir(false);
                                  }
                                  return;
                                }
                                setEtapaActual(accion.tab);
                              }}
                            >
                              {procesandoConcluir ? 'Procesando...' : accion.label}
                            </button>
                          );
                        }

                        return (
                          <button
                            key={i}
                            className="bdg-btn-action"
                            onClick={() => accion.ruta && navigate(accion.ruta)}
                          >
                            {accion.label}
                          </button>
                        );
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

        </div>
      )}
    </div>
  );
};

      {detalleModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200 }}>
          <div style={{ width: 680, maxWidth: '94%', background: '#fff', borderRadius: 8, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontWeight: 800 }}>{detalleTipo === 'AUDIENCIA' ? 'Audiencia' : 'Sentencia'}</div>
              <button className="bdg-btn-action" onClick={() => { setDetalleModal(null); setDetalleTipo(null); }}>Cerrar</button>
            </div>

            <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              <dl style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 8 }}>
                <dt style={{ fontWeight: 700 }}>Folio</dt><dd>{detalleModal.folioGobierno ?? detalleModal.folio ?? '—'}</dd>
                <dt style={{ fontWeight: 700 }}>Contribuyente</dt><dd>{detalleModal.contribuyente ?? '—'}</dd>
                {detalleTipo === 'AUDIENCIA' ? (
                  <>
                    <dt style={{ fontWeight: 700 }}>Fecha audiencia</dt><dd>{detalleModal.fechaAudiencia ?? '—'}</dd>
                    <dt style={{ fontWeight: 700 }}>Lugar / Observaciones</dt><dd>{detalleModal.observacionesAudiencia ?? detalleModal.lugarAudiencia ?? '—'}</dd>
                  </>
                ) : (
                  <>
                    <dt style={{ fontWeight: 700 }}>Fecha sentencia</dt><dd>{detalleModal.fechaSentencia ?? '—'}</dd>
                    <dt style={{ fontWeight: 700 }}>Resumen</dt><dd>{detalleModal.resumenSentencia ?? detalleModal.observacionesSentencia ?? '—'}</dd>
                  </>
                )}

                <dt style={{ fontWeight: 700 }}>Estatus</dt><dd>{detalleModal.estatus ?? '—'}</dd>
              </dl>
            </div>

            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="bdg-btn-action" onClick={() => { setDetalleModal(null); setDetalleTipo(null); }}>Cerrar</button>
            </div>
          </div>
        </div>
      )}


export default TablaIrl;