import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { EditorOficioNotificacion } from '../../../features/modulo-area-sustantiva/atencion-juridica/oficio-notificacion/components/EditorOficioNotificacion';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_dev';

export const OficioNotificacionPage = () => {
  const { folio } = useParams();
  const navigate  = useNavigate();

  const [expediente, setExpediente] = useState(null);
  const [cargando,   setCargando]   = useState(true);

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
        Oficio de Notificación
      </h1>

      <EditorOficioNotificacion
        expediente={expediente}
        folioExpediente={folio}
      />
    </div>
  );
};