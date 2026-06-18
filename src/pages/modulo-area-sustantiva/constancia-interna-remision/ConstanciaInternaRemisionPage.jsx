import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { EditorCIR } from '../../../features/modulo-area-sustantiva/constancia-interna-remision/components/EditorCIR';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_dev';

export const ConstanciaInternaRemisionPage = () => {
  const { folio } = useParams();
  const navigate  = useNavigate();

  const [expediente, setExpediente] = useState(null);
  // Inicializamos 'cargando' en true SOLO si hay un folio.
  // Si folio es undefined/null, inicializa en false directamente.
  const [cargando, setCargando] = useState(!!folio);

  useEffect(() => {
    // Si no hay folio, simplemente salimos del efecto sin mutar el estado de forma síncrona
    if (!folio) return; 

    // Variable para evitar mutar el estado si el componente se desmonta mientras carga
    let isMounted = true;

    fetch(`${API}/api/v1/expedientes/${folio}/detalle-asesoria`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (isMounted) setExpediente(data);
      })
      .catch(() => {
        // Manejo de errores silencioso como tenías
      })
      .finally(() => {
        if (isMounted) setCargando(false);
      });

    // Función de limpieza que se ejecuta si el componente se desmonta
    return () => {
      isMounted = false;
    };
  }, [folio]);

  if (cargando) {
    return (
      <div style={{ padding: '2rem' }}>
        <p>Cargando expediente...</p>
      </div>
    );
  }

  // Si después de validar no hay folio válido, mostramos un aviso en lugar de intentar renderizar el editor
  if (!folio) {
    return (
      <div style={{ padding: '1.5rem 2rem' }}>
        <p style={{ color: '#dc2626', fontWeight: 'bold', marginBottom: '1rem' }}>
          No se proporcionó un folio válido o no existe en la URL.
        </p>
        <button
          onClick={() => navigate(-1)}
          style={{ padding: '0.5rem 1rem', background: '#e5e7eb', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Volver atrás
        </button>
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
        Constancia Interna de Remisión
      </h1>

      <EditorCIR
        expediente={expediente}
        folioExpediente={folio}
      />
    </div>
  );
};