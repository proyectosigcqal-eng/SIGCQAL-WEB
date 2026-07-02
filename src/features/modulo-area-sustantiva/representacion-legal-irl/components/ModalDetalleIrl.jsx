import { useEffect, useState } from 'react';
import { X, FileText } from 'lucide-react';


const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_Prod';


const Field = ({ label, value }) => (
  <div style={{ marginBottom: '0.75rem' }}>
    <div style={{
      fontSize: '0.7rem', fontWeight: 700, color: '#64748b',
      textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem',
    }}>
      {label}
    </div>
    <div style={{ fontSize: '0.875rem', color: '#0f172a' }}>
      {value || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No registrado</span>}
    </div>
  </div>
);

const Section = ({ title, children }) => (
  <div style={{
    border: '1px solid #e2e8f0', borderRadius: 8,
    padding: '1rem', marginBottom: '1rem',
  }}>
    <h4 style={{
      fontSize: '0.78rem', fontWeight: 700, color: '#1e3a8a',
      textTransform: 'uppercase', letterSpacing: '0.06em',
      margin: '0 0 0.75rem 0',
    }}>
      {title}
    </h4>
    {children}
  </div>
);

const LinkPdf = ({ url, label }) => {
  if (!url) return null;
  return (
    <a
      href={`${API}${url}`}
      target="_blank"
      rel="noreferrer"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        marginTop: '0.5rem', fontSize: '0.82rem',
        color: '#1e3a8a', fontWeight: 600,
      }}
    >
      <FileText size={14} /> {label}
    </a>
  );
};

// Verifica si al menos un campo del grupo tiene valor
const tieneData = (...valores) => valores.some(v => v != null && v !== '');

export const ModalDetalleIrl = ({ folio, etapa, onClose }) => {
  const [datos,    setDatos]    = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    if (!folio) return;
    setCargando(true);
    // ← URL corregida
    fetch(`${API}/api/v1/tramites/bandeja-representacion-legal/detalle-irl/${folio}`)
      .then(r => r.ok ? r.json() : Promise.reject(`Error ${r.status}`))
      .then(setDatos)
      .catch(e => setError(String(e)))
      .finally(() => setCargando(false));
  }, [folio]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const hayAudienciaEspera = datos && tieneData(
    datos.numeroOficioAdmision, datos.fechaNotificacionOficio,
    datos.fechaHoraAudienciaProg, datos.observacionesEspera
  );

  const hayAudienciaCelebrada = datos && tieneData(
    datos.fechaHoraCelebracion, datos.resultadoAudiencia, datos.salaOModalidad
  );

  const haySentenciaDictada = datos && tieneData(
    datos.fechaDictado, datos.sentidoFallo, datos.puntosResolutivos
  );

  const haySentenciaEjecutoria = datos && tieneData(
    datos.numeroOficioEjecutoria, datos.fechaDeclaracionEjecutoria
  );

  const hayNotificacionCumplida = datos && tieneData(
    datos.numeroOficioCumplimiento, datos.fechaNotificacionArchivo
  );

  const hayAlgo = hayAudienciaEspera || hayAudienciaCelebrada
                || haySentenciaDictada || haySentenciaEjecutoria
                || hayNotificacionCumplida;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 12,
          width: '100%', maxWidth: 700,
          maxHeight: '90vh', display: 'flex', flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #e2e8f0',
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f1b3d' }}>
              Detalle IRL — {folio}
            </h3>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: '#64748b' }}>
              Etapa actual: <strong>{etapa ?? '—'}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', padding: '1.25rem 1.5rem', flex: 1 }}>

          {cargando && (
            <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>
              Cargando datos...
            </p>
          )}

          {error && (
            <p style={{ color: '#dc2626', textAlign: 'center', padding: '2rem' }}>
              Error al cargar: {error}
            </p>
          )}

          {datos && !cargando && (
            <>
              {/* ── Audiencia en Espera ── */}
              {hayAudienciaEspera && (
                <Section title="Audiencia en Espera">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
                    <Field label="Nº Oficio Admisión"       value={datos.numeroOficioAdmision} />
                    <Field label="Fecha Notificación Oficio" value={datos.fechaNotificacionOficio} />
                    <Field label="Fecha/Hora Audiencia Prog." value={datos.fechaHoraAudienciaProg} />
                    <Field label="Observaciones"             value={datos.observacionesEspera} />
                  </div>
                  <LinkPdf url={datos.rutaPdfOficioEspera} label="Ver Oficio de Admisión" />
                </Section>
              )}

              {/* ── Audiencia Celebrada ── */}
              {hayAudienciaCelebrada && (
                <Section title="Audiencia Celebrada">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
                    <Field label="Fecha/Hora Celebración" value={datos.fechaHoraCelebracion} />
                    <Field label="Nº Oficio Acta"         value={datos.numeroOficioActa} />
                    <Field label="Sala / Modalidad"       value={datos.salaOModalidad} />
                    <Field label="Resultado"              value={datos.resultadoAudiencia} />
                    <Field label="Asistió Autoridad"
                      value={datos.asistioAutoridad == null
                        ? null
                        : datos.asistioAutoridad ? 'Sí' : 'No'} />
                  </div>
                  <LinkPdf url={datos.rutaPdfOficioCelebrada} label="Ver Acta de Audiencia" />
                </Section>
              )}

              {/* ── Sentencia Dictada ── */}
              {haySentenciaDictada && (
                <Section title="Sentencia Dictada">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
                    <Field label="Fecha Dictado"              value={datos.fechaDictado} />
                    <Field label="Fecha Notificación"         value={datos.fechaNotificacionSentencia} />
                    <Field label="Sentido del Fallo"          value={datos.sentidoFallo} />
                    <Field label="Nº Oficio Sentencia"        value={datos.numeroOficioSentencia} />
                  </div>
                  {datos.puntosResolutivos && (
                    <Field label="Puntos Resolutivos" value={datos.puntosResolutivos} />
                  )}
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <LinkPdf url={datos.rutaArchivoSentencia}  label="Ver Sentencia" />
                    <LinkPdf url={datos.rutaPdfOficioSentencia} label="Ver Oficio Sentencia" />
                  </div>
                </Section>
              )}

              {/* ── Sentencia Ejecutoria ── */}
              {haySentenciaEjecutoria && (
                <Section title="Sentencia Ejecutoria">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
                    <Field label="Nº Oficio Ejecutoria"       value={datos.numeroOficioEjecutoria} />
                    <Field label="Fecha Declaración"          value={datos.fechaDeclaracionEjecutoria} />
                    <Field label="Requerimiento Cumplimiento" value={datos.requerimientoCumplimiento} />
                  </div>
                  <LinkPdf url={datos.rutaPdfOficioEjecutoria} label="Ver Oficio Ejecutoria" />
                </Section>
              )}

              {/* ── Notificación Sentencia Cumplida ── */}
              {hayNotificacionCumplida && (
                <Section title="Notificación Sentencia Cumplida">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
                    <Field label="Nº Oficio Cumplimiento" value={datos.numeroOficioCumplimiento} />
                    <Field label="Nº Oficio Archivo"      value={datos.numeroOficioArchivo} />
                    <Field label="Fecha Notificación"     value={datos.fechaNotificacionArchivo} />
                    <Field label="Observaciones Finales"  value={datos.observacionesFinales} />
                  </div>
                  <LinkPdf url={datos.rutaPdfOficioCumplimiento} label="Ver Oficio Cumplimiento" />
                </Section>
              )}

              {/* Sin datos */}
              {!hayAlgo && (
                <div style={{
                  textAlign: 'center', padding: '2rem',
                  color: '#94a3b8', fontSize: '0.875rem',
                }}>
                  No hay datos adicionales registrados para esta etapa.
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid #e2e8f0',
          display: 'flex', justifyContent: 'flex-end',
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 20px', background: '#f1f5f9',
              border: '1px solid #e2e8f0', borderRadius: 7,
              fontWeight: 600, fontSize: '0.82rem',
              cursor: 'pointer', color: '#475569',
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};