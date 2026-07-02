import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatearFecha, obtenerColorSemaforo } from "../../../modulo-area-sustantiva/comisionado-irl/utils/semaforo";
import { SemaforoJudicial } from "@/features/modulo-area-sustantiva/demanda-amparo/components/SemaforoJudicial";
import { cerrarExpediente } from "@/features/modulo-area-sustantiva/notificacion-cierre-y-acuerdo-de-razon/services/cierreService";
// ✅ corregido: import NOMBRADO (tu archivo exporta `export const ModalDetalleIrl`, no default) + nombre bien escrito
import { ModalDetalleIrl } from "@/features/modulo-area-sustantiva/representacion-legal-irl/components/ModalDetalleIrl";

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_Prod';

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

const calcularAccionesIrl = (item, estUp) => {
  const folio = item.folioGobierno ?? item.folio ?? item.idExpediente ?? item.id;
  const acciones = [];
  // Normalizar flags: aceptamos booleanos o la presencia de una fecha (/snake_case)
  const tieneAudienciaFlag = !!(
    item?.tieneAudiencia || item?.tiene_audiencia || item?.fechaAudiencia || item?.fecha_audiencia
  );
  const tieneSentenciaFlag = !!(
    item?.tieneSentencia || item?.tiene_sentencia || item?.fechaSentencia || item?.fecha_sentencia
  );

  if (!estUp || estUp.includes('ASIGNADO')) {
    acciones.push({ tipo: 'navegacion', label: 'REGISTRAR CIR',
      ruta: `/area-sustantiva/rl-cir/${folio}` });
    return acciones;
  }

  if (estUp.includes('CIR')) {
    acciones.push({
      tipo: 'navegacion',
      label: item.tieneDemanda ? 'VER DEMANDA' : 'REGISTRAR DEMANDA',
      ruta: `/atencion-juridica/demanda-amparo/${folio}`,
    });
    const idRlCir = item.idRlCir ?? item.id_rl_cir;
    const idQuejaRlCir = item.idQuejaRlCir ?? item.id_queja_rl_cir;
    if (idRlCir) {
      acciones.push({
        tipo: 'descarga',
        label: 'DESCARGAR CIR',
        url: `${API}/api/v1/rl-cir/${idRlCir}/descargar`,
        filename: `CIR-${folio}.docx`,
      });
    }
    if (idQuejaRlCir) {
      acciones.push({
        tipo: 'descarga',
        label: 'DESCARGAR CIR QUEJA',
        url: `${API}/api/v1/queja-rl-cir/${idQuejaRlCir}/descargar`,
        filename: `CIR-QUEJA-${folio}.docx`,
      });
    }
    return acciones;
  }

  if (estUp.includes('DEMANDA')) {
    acciones.push({ tipo: 'navegacion', label: 'REGISTRAR AUDIENCIA',
      ruta: `/sustantiva/audiencia-espera` });
    const idDemanda = item.idDemandaAmparo ?? item.idDemanda;
    if (idDemanda) {
      acciones.push({
        tipo: 'descarga',
        label: 'DESCARGAR DEMANDA',
        url: `${API}/api/v1/irl-demanda-amparo/${idDemanda}/descargar`,
        filename: `DEMANDA-${folio}.docx`,
      });
    }
    return acciones;
  }

  if (estUp.includes('ESPERA')) {
    acciones.push({
      tipo: 'navegacion',
      label: tieneAudienciaFlag ? 'VER AUDIENCIA' : 'REGISTRAR AUDIENCIA',
      ruta: `/sustantiva/audiencia-celebrada`,
    });
    if (tieneAudienciaFlag) {
      acciones.push({ tipo: 'modal', modalType: 'AUDIENCIA', label: 'DATOS AUDIENCIA' });
    }
    return acciones;
  }

  if (estUp.includes('CELEBRADA')) {
    acciones.push({
      tipo: 'navegacion',
      label: tieneSentenciaFlag ? 'VER SENTENCIA' : 'REGISTRAR SENTENCIA',
      ruta: `/sustantiva/sentencia-dictada`,
    });
    // ✅ el modal de audiencia también se ofrece aquí — ya se registró en la etapa anterior
    if (tieneAudienciaFlag) {
      acciones.push({ tipo: 'modal', modalType: 'AUDIENCIA', label: 'DATOS AUDIENCIA' });
    }
    if (tieneSentenciaFlag) {
      acciones.push({ tipo: 'modal', modalType: 'SENTENCIA', label: 'DATOS SENTENCIA' });
    }
    return acciones;
  }

  if (estUp.includes('DICTADA')) {
    acciones.push({ tipo: 'navegacion', label: 'RECURSO REVISIÓN',
      ruta: `/sustantiva/recurso-revision` });
    acciones.push({
      tipo: 'navegacion',
      label: item.tieneEjecutoria ? 'VER EJECUTORIA' : 'SENTENCIA EJECUTORIA',
      ruta: `/sustantiva/sentencia-ejecutoria`,
    });
    // ✅ la sentencia ya está registrada en esta etapa — se puede consultar sin navegar
    if (tieneSentenciaFlag) {
      acciones.push({ tipo: 'modal', modalType: 'SENTENCIA', label: 'DATOS SENTENCIA' });
    }
    return acciones;
  }

  if (estUp.includes('REVISIÓN') || estUp.includes('REVISION')) {
    acciones.push({
      tipo: 'navegacion',
      label: item.tieneEjecutoria ? 'VER EJECUTORIA' : 'REGISTRAR EJECUTORIA',
      ruta: `/sustantiva/sentencia-ejecutoria`,
    });
    // ✅ el recurso ya está en curso en esta etapa — se puede consultar
    acciones.push({ tipo: 'modal', modalType: 'RECURSO_REVISION', label: 'DATOS RECURSO' });
    return acciones;
  }

  if (estUp.includes('EJECUTORIA')) {
    acciones.push({
      tipo: 'navegacion',
      label: item.tieneCumplimiento ? 'VER NOTIFICACIÓN' : 'NOTIFICAR CUMPLIMIENTO',
      ruta: `/sustantiva/notificacion-sentencia`,
    });
    if (item.tieneEjecutoria) {
      acciones.push({ tipo: 'modal', modalType: 'SENTENCIA_EJECUTADA', label: 'DATOS EJECUTORIA' });
    }
    return acciones;
  }

  if (estUp.includes('CUMPLIMIENTO')) {
    acciones.push({ tipo: 'tab', label: 'PASAR A CONCLUIDO', tab: 'CONCLUIDO' });
    if (item.tieneCumplimiento) {
      acciones.push({ tipo: 'modal', modalType: 'CUMPLIMIENTO', label: 'DATOS CUMPLIMIENTO' });
    }
    return acciones;
  }

  if (estUp.includes('CONCLUIDO')) {
    acciones.push({ tipo: 'info', label: 'CONCLUIDO', ruta: null });
    return acciones;
  }

  acciones.push({ tipo: 'navegacion', label: 'ATENDER',
    ruta: `/atencion-juridica/demanda-amparo/${folio}` });
  return acciones;
};

export const TablaIrl = ({
  subSwitchActivo, setSubSwitchActivo,
  etapaActiva, setEtapaActiva,
  estatusActivo, setEstatusActivo,
  busqueda, setBusqueda,
  items, cargando, error,
  SUB_SWITCHES, ESTATUS_TABS,
  recargar,
}) => {
  const navigate = useNavigate();
  const [procesandoConcluir, setProcesandoConcluir] = useState(false);
  const [semaforos, setSemaforos]     = useState({});
  const [semaforoCargando, setSemaforoCargando] = useState(false);

  // ✅ reemplaza detalleModal (item completo) + detalleTipo por { folio, etapa },
  // que es justo lo que espera <ModalDetalleIrl folio etapa onClose />
  const [modalDetalle, setModalDetalle] = useState(null); // { folio, etapa } | null

  const etapaActual    = etapaActiva    ?? estatusActivo    ?? "TODAS";
  const setEtapaActual = setEtapaActiva ?? setEstatusActivo ?? (() => {});

  const descargarDesdeUrl = async (url, filenameFallback) => {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        window.alert('No fue posible descargar el archivo.');
        return;
      }
      const blob = await res.blob();
      const disposition = res.headers.get('content-disposition') || '';
      let filename = filenameFallback || 'documento.docx';
      const m = disposition.match(/filename="?([^";]+)"?/);
      if (m?.[1]) filename = m[1];
      const link = document.createElement('a');
      link.href  = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      console.error('Error descargando archivo:', e);
      window.alert('Error al descargar el archivo.');
    }
  };

  const getDemandaId = (item) =>
    item?.idDemandaAmparo ?? item?.idDemanda ?? null;

  const calcularFechaLimite = (fechaRegistro) => {
    if (!fechaRegistro) return null;
    const fecha = new Date(fechaRegistro);
    if (Number.isNaN(fecha.getTime())) return null;
    let diasHabiles = 15;
    let actual = new Date(fecha);
    actual.setDate(actual.getDate() + 1);
    while (diasHabiles > 0) {
      const dia = actual.getDay();
      if (dia !== 0 && dia !== 6) diasHabiles -= 1;
      if (diasHabiles > 0) actual.setDate(actual.getDate() + 1);
    }
    return actual.toISOString().slice(0, 10);
  };

  const contarDiasHabilesEntre = (inicio, fin) => {
    const s = new Date(inicio); const e = new Date(fin);
    s.setHours(0,0,0,0); e.setHours(0,0,0,0);
    if (s > e) return 0;
    let cuenta = 0; let actual = new Date(s);
    while (actual <= e) {
      if (actual.getDay() !== 0 && actual.getDay() !== 6) cuenta++;
      actual.setDate(actual.getDate() + 1);
    }
    return cuenta;
  };

  const obtenerSemaforoLocal = (item) => {
    const fechaRegistro = item?.fechaRegistro ?? item?.fechaDemanda ?? item?.fechaCreacion;
    const fechaLimite = calcularFechaLimite(fechaRegistro);
    if (!fechaLimite) return null;
    const hoy = new Date();
    const inicioCuenta = new Date(hoy);
    inicioCuenta.setDate(inicioCuenta.getDate() + 1);
    inicioCuenta.setHours(0,0,0,0);
    const diasHabilesRestantes = contarDiasHabilesEntre(inicioCuenta, new Date(fechaLimite));
    const color = obtenerColorSemaforo(diasHabilesRestantes);
    const limite = new Date(fechaLimite); limite.setHours(23,59,59,999);
    return { color, diasHabilesRestantes, fechaLimite, vencido: diasHabilesRestantes === 0 && hoy > limite };
  };

  useEffect(() => {
    let mounted = true;
    const demandaIds = (items || []).map(it => getDemandaId(it)).filter(Boolean);
    if (etapaActual !== 'DEMANDA_PRESENTADA' || demandaIds.length === 0) {
      setSemaforos({}); return;
    }
    setSemaforoCargando(true);
    Promise.all(
      demandaIds.map(id =>
        fetch(`${API}/api/v1/irl-demanda-amparo/${id}/semaforo-judicial`)
          .then(r => r.ok ? r.json() : null).catch(() => null)
      )
    ).then(results => {
      if (!mounted) return;
      const map = {};
      demandaIds.forEach((id, i) => { map[id] = results[i]; });
      setSemaforos(map);
    }).finally(() => { if (mounted) setSemaforoCargando(false); });
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
          style={{ width: "100%", maxWidth: 400 }}
        />
      </div>

      {/* ── Sub-switches ── */}
      <div style={{
        display: "flex", gap: 0, marginBottom: "0.75rem",
        borderRadius: 8, border: "0.5px solid var(--color-border-secondary)",
        overflow: "hidden", width: "fit-content",
      }}>
        {SUB_SWITCHES.map((sw, i) => (
          <button key={sw.key} type="button"
            onClick={() => setSubSwitchActivo(sw.key)}
            style={{
              ...tabStyle(subSwitchActivo === sw.key),
              borderRight: i < SUB_SWITCHES.length - 1
                ? "0.5px solid var(--color-border-secondary)" : "none",
            }}>
            {sw.label}
          </button>
        ))}
      </div>

      {/* ── Tabs de etapa ── */}
      <div className="bdg-etapas-scroll" style={{
        display: "flex", overflowX: "auto", marginBottom: "1rem",
        borderRadius: 6, border: "0.5px solid var(--color-border-secondary)",
      }}>
        {(ESTATUS_TABS ?? []).map((tab) => (
          <button key={tab.key ?? tab.id ?? "todos"} type="button"
            onClick={() => setEtapaActual(tab.key ?? tab.id ?? "TODAS")}
            style={{
              ...tabStyle(etapaActual === (tab.key ?? tab.id ?? "TODAS")),
              borderRight: "0.5px solid var(--color-border-secondary)",
              flexShrink: 0,
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Contenido ── */}
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
                const estUp    = (item.estatus ?? "").toUpperCase();
                const acciones = calcularAccionesIrl(item, estUp);
                const demandaId = getDemandaId(item);
                const rowKey = item.idRepresentacionLegal ?? item.id
                  ?? item.idExpediente ?? item.folioGobierno ?? `irl-row-${index}`;

                return (
                  <tr key={rowKey}>
                    <td><div className="bdg-folio">{item.folioGobierno || "—"}</div></td>
                    <td><div className="bdg-contribuyente">{item.contribuyente || "—"}</div></td>
                    <td><div className="bdg-sub">{item.municipio || "—"}</div></td>
                    <td><div className="bdg-sub">{formatearFecha(item.fechaRegistro ?? item.fechaCreacion)}</div></td>

                    {etapaActual === 'DEMANDA_PRESENTADA' && (
                      <td>
                        {demandaId ? (
                          semaforoCargando && !semaforos[demandaId]
                            ? <span className="semaforo-cargando">Calculando...</span>
                            : (() => {
                                const sem = semaforos[demandaId] || obtenerSemaforoLocal(item);
                                return sem ? <SemaforoJudicial semaforo={sem} /> : <span>—</span>;
                              })()
                        ) : <span>—</span>}
                      </td>
                    )}

                    <td>
                      <span className="bdg-badge bdg-badge--estatus">
                        {item.estatus || "—"}
                      </span>
                    </td>

                    <td className="bdg-action-cell">
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {acciones.map((accion, i) => {
                          if (accion.tipo === "info") {
                            return (
                              <span key={i} className="bdg-btn-action bdg-btn-action--disabled"
                                style={{ cursor: "default" }}>
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
                        }

                      

                          if (accion.tipo === "tab") {
  return (
    <button key={i} className="bdg-btn-action"
      disabled={procesandoConcluir}
      onClick={async () => {
        if ((accion.tab ?? "").toUpperCase() !== "CONCLUIDO") {
          setEtapaActual(accion.tab);
          return;
        }
        if (procesandoConcluir) return;
        setProcesandoConcluir(true);
        try {
          // ✅ mismo patrón que CierrePage.jsx
          const storedUser = (() => {
            const raw = sessionStorage.getItem('sigcqal_session');
            if (!raw) return null;
            try { return JSON.parse(raw); } catch { return null; }
          })();

          const userId = storedUser?.idUsuario
                      ?? storedUser?.id
                      ?? storedUser?.usuarioId
                      ?? null;

          if (!userId) {
            window.alert('No se encontró sesión de usuario. Por favor inicia sesión nuevamente.');
            return;
          }

          const idExp    = Number(item.idExpediente ?? item.id);
          const folioVal = item.folioGobierno ?? item.folio ?? idExp;

         let cierreExitoso = false;
try {
  await cerrarExpediente({
    idExpediente:       idExp || null,
    medioNotificacion:  'CORREO ELECTRONICO',
    rutaArchivoAcuerdo: `/almacen/acuerdos/EXPEDIENTE_${folioVal}.pdf`,
    idUsuarioCierre:    Number(userId),
  });
  cierreExitoso = true;
} catch (e) {
  // ¿Es un error HTTP real (4xx / 5xx)?
  const esErrorServidor = /\b[45]\d{2}\b/.test(e?.message ?? '');
  if (esErrorServidor) {
    window.alert('No fue posible concluir el expediente: ' + e.message);
    return;
  }
  // Error de parseo de respuesta vacía (204 / void) — el backend SÍ actuó
  console.warn('[Cierre] Response sin body, asumiendo éxito:', e.message);
  cierreExitoso = true;
}

if (cierreExitoso) {
  setEtapaActual('CONCLUIDO');
  if (typeof recargar === 'function') await recargar().catch(() => {});
}if (typeof recargar === 'function') await recargar().catch(() => {});
        } catch (e) {
          console.error('Error al concluir:', e);
          window.alert('No fue posible concluir el expediente.');
        } finally {
          setProcesandoConcluir(false);
        }
      }}>
      {procesandoConcluir ? 'Procesando...' : accion.label}
    </button>
  );
}

                          return (
                            <button key={i} className="bdg-btn-action"
                              onClick={() => accion.ruta && navigate(accion.ruta)}>
                              {accion.label}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                  
                );
              })}
            </tbody>

          </table>
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
           
        </div>
      )}
    </div>
  );
};


export default TablaIrl;