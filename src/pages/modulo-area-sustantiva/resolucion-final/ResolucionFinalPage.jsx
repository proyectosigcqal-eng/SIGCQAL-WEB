import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { EditorResolucionFinal } from '../../../features/modulo-area-sustantiva/resolucion-final/components/EditorResolucionFinal';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_dev';

export const ResolucionFinalPage = () => {
  const { folio } = useParams();
  const navigate = useNavigate();

  const [expediente, setExpediente] = useState(null);
  const [datosPrevios, setDatosPrevios] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!folio) { setCargando(false); return; }

    Promise.all([
      fetch(`${API}/api/v1/expedientes/${folio}/detalle-asesoria`).then(r => r.ok ? r.json() : null),
      fetch(`${API}/api/modulo-area-sustantiva/resolucion-final/datos-previos/${folio}`).then(r => r.ok ? r.json() : null),
    ])
      .then(([detalle, previos]) => {
        setExpediente(detalle);
        if (!previos) {
          setError('No se encontró información previa (ARI/contestación) para este folio.');
        }
        setDatosPrevios(previos);
      })
      .catch(() => setError('Error al cargar la información del expediente.'))
      .finally(() => setCargando(false));
  }, [folio]);

  if (cargando) {
    return (
      <div style={{ padding: '2rem' }}>
        <p>Cargando expediente...</p>
      </div>
    );
  }

  // En ResolucionFinalPage.jsx, reemplaza el bloque de retorno final:
return (
  <div style={{ padding: '1.5rem 2rem' }}>
    <button
      onClick={() => navigate(-1)}
      style={{
        background: 'none', border: 'none', color: '#1e3a8a',
        fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.06em',
        cursor: 'pointer', display: 'flex', alignItems: 'center',
        gap: '0.4rem', marginBottom: '1rem', padding: 0,
      }}
    >
      <ArrowLeft size={15} /> REGRESAR
    </button>

    <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f1b3d', marginBottom: '1.5rem' }}>
      Resolución Final
    </h1>

    {/* Aviso no bloqueante — el editor igual se muestra */}
    {error && (
      <div style={{
        background: '#fef3cd', border: '1px solid #f0c36d', borderRadius: '6px',
        padding: '0.75rem 1rem', marginBottom: '1rem',
        color: '#7a5b14', fontSize: '0.85rem',
      }}>
        ⚠ {error} Los campos relacionales quedarán en blanco.
      </div>
    )}

    <EditorResolucionFinal
      expediente={expediente}
      folioExpediente={folio}
      idExpediente={datosPrevios?.idExpediente      ?? null}
      idAri={datosPrevios?.idAri                    ?? null}
      idQuejaRespuestaAutoridad={datosPrevios?.idQuejaRespuestaAutoridad ?? null}
      idEstatusQueja={datosPrevios?.idEstatusQueja  ?? null}
      idEstatusExpediente={datosPrevios?.idEstatusExpediente ?? null}
      fechaSolicitudPrevia={datosPrevios?.fechaSolicitud    ?? null}
      numeroOficioPrevio={datosPrevios?.numeroOficio        ?? null}
      fechaOficioPrevia={datosPrevios?.fechaOficio          ?? null}
    />
  </div>
);
};