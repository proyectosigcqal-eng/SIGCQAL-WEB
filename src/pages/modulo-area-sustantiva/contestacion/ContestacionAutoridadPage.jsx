import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ContestacionAutoridadForm } from '@/features/modulo-area-sustantiva/atencion-juridica/contestacion/components/ContestacionAutoridadForm';
import { EditorACCI } from '@/features/modulo-area-sustantiva/atencion-juridica/contestacion/components/EditorACCI';
import '@/features/modulo-area-sustantiva/atencion-juridica/contestacion/styles/contestacion-autoridad.css';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_dev';

export const ContestacionAutoridadPage = () => {
  const { folio } = useParams();
  const navigate  = useNavigate();

  const [expediente, setExpediente] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [fase, setFase]             = useState('formulario');

  const [contestacion, setContestacion] = useState({
    numOficio: '', dependencia: '', encargado: '',
    observaciones: '', archivoPDF: null,
  });
  const [decision, setDecision] = useState(null);

  useEffect(() => {
    if (!folio) { setLoading(false); return; }
    fetch(`${API}/api/v1/expedientes/${folio}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setExpediente)
      .catch(() => setError('No se pudo cargar el expediente'))
      .finally(() => setLoading(false));
  }, [folio]);

  const handleGuardadoExitoso = (decisionGuardada) => {
    if (decisionGuardada === 'acci') setFase('acci');
    else navigate(`/atencion-juridica/resolucion-final/${folio}`);
  };

  if (loading) return <div className="ca-page"><p>Cargando expediente...</p></div>;

  // ── FASE ACCI — ocupa toda la página sin wrapper extra ──
  if (fase === 'acci') {
    return (
      <div className="ca-page">
        <button className="ca-back-btn" onClick={() => setFase('formulario')}>
          ← Regresar
        </button>
        <h1 className="ca-title">Generador de ACCI</h1>
        {/* EditorACCI ya define internamente el layout .acci-layout de 2 columnas */}
        <EditorACCI
          expediente={expediente}
          contestacion={contestacion}
          folioExpediente={folio}
        />
      </div>
    );
  }

  // ── FASE FORMULARIO ──
  return (
    <div className="ca-page">
      <button className="ca-back-btn" onClick={() => navigate(-1)}>
        ← Regresar
      </button>
      <h1 className="ca-title">Contestación de Autoridad</h1>
      {expediente && (
        <p className="ca-folio">
          Expediente: <strong>{expediente.folioGobierno ?? expediente.folio}</strong>
        </p>
      )}
      {error && <div className="ca-alert-error">{error}</div>}

      <ContestacionAutoridadForm
        folio={folio}
        contestacion={contestacion}
        setContestacion={setContestacion}
        decision={decision}
        setDecision={setDecision}
        onGuardadoExitoso={handleGuardadoExitoso}
      />
    </div>
  );
};