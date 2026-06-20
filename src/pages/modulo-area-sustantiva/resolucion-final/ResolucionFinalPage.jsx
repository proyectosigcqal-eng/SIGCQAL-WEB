import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { EditorResolucionFinal } from '../../../features/modulo-area-sustantiva/resolucion-final/components/EditorResolucionFinal';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_dev';

export const ResolucionFinalPage = () => {
  const { folio } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Los IDs relacionados (ARI, respuesta de autoridad, estatus) no vienen
  // de un solo endpoint — se resuelven en las pantallas anteriores del
  // flujo y llegan aquí vía state de navegación de React Router:
  //   navigate(`/resolucion-final/${folio}`, {
  //     state: { idExpediente, idAri, idQuejaRespuestaAutoridad, idEstatusQueja, idEstatusExpediente }
  //   });
  const {
    idExpediente,
    idAri,
    idQuejaRespuestaAutoridad,
    idEstatusQueja,
    idEstatusExpediente,
  } = location.state ?? {};

  const [expediente, setExpediente] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!folio) { setCargando(false); return; }

    fetch(`${API}/api/v1/expedientes/${folio}/detalle-asesoria`)
      .then(r => r.ok ? r.json() : null)
      .then(data => setExpediente(data))
      .catch(() => {})
      .finally(() => setCargando(false));
  }, [folio]);

  if (cargando) {
    return (
      <div style={{ padding: '2rem' }}>
        <p>Cargando expediente...</p>
      </div>
    );
  }

  const faltanIds = !idExpediente || !idAri || !idQuejaRespuestaAutoridad
      || !idEstatusQueja || !idEstatusExpediente;

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

      {faltanIds && (
        <div style={{
          background: '#fef3cd', border: '1px solid #f0c36d', borderRadius: '6px',
          padding: '0.75rem 1rem', marginBottom: '1rem', color: '#7a5b14', fontSize: '0.85rem',
        }}>
          No se recibió la información del expediente desde la pantalla anterior
          (esto pasa si recargaste la página directamente). Regresa y vuelve a
          entrar desde el flujo normal para continuar.
        </div>
      )}

      <EditorResolucionFinal
        expediente={expediente}
        folioExpediente={folio}
        idExpediente={idExpediente}
        idAri={idAri}
        idQuejaRespuestaAutoridad={idQuejaRespuestaAutoridad}
        idEstatusQueja={idEstatusQueja}
        idEstatusExpediente={idEstatusExpediente}
      />
    </div>
  );
};