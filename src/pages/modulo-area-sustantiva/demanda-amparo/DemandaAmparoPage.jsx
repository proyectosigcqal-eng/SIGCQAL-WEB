import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { FormularioDemandaAmparo } from '../../../features/modulo-area-sustantiva/demanda-amparo/components/FormularioDemandaAmparo';
import { SemaforoJudicial } from '../../../features/modulo-area-sustantiva/demanda-amparo/components/SemaforoJudicial';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_Prod';

export const DemandaAmparoPage = () => {
  const { folio } = useParams();
  const navigate  = useNavigate();

  const [expediente,      setExpediente]      = useState(null);
  const [demandaExistente, setDemandaExistente] = useState(null);
  const [semaforo,         setSemaforo]         = useState(null);
  const [cargando,         setCargando]         = useState(true);
  const [error,            setError]            = useState(null);

  useEffect(() => {
    if (!folio) { setCargando(false); return; }

    Promise.all([
      fetch(`${API}/api/v1/expedientes/${folio}/detalle-asesoria`)
        .then(r => r.ok ? r.json() : null),
      fetch(`${API}/api/v1/irl-demanda-amparo/expediente/${folio}`)
        .then(r => r.ok ? r.json() : null)
        .catch(() => null),
    ])
      .then(([detalle, demanda]) => {
        console.log('>>> expediente detalle:', detalle);
        setExpediente(detalle);
        setDemandaExistente(demanda);

        // Si ya existe la demanda, carga el semáforo (backend debe calcular con fecha_registro)
        if (demanda?.idDemandaAmparo) {
          return fetch(
            `${API}/api/v1/irl-demanda-amparo/${demanda.idDemandaAmparo}/semaforo-judicial`
          ).then(r => r.ok ? r.json() : null);
        }
        return null;
      })
      .then(sem => setSemaforo(sem))
      .catch(() => setError('Error al cargar el expediente.'))
      .finally(() => setCargando(false));
  }, [folio]);

  if (cargando) return (
    <div style={{ padding: '2rem' }}><p>Cargando expediente...</p></div>
  );

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

      <div style={{ display: 'flex', alignItems: 'flex-start',
                    justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f1b3d', margin: 0 }}>
          Demanda de Amparo Indirecto
        </h1>
        {semaforo && <SemaforoJudicial semaforo={semaforo} />}
      </div>

      {error && (
        <div style={{
          background: '#fef3cd', border: '1px solid #f0c36d', borderRadius: 6,
          padding: '0.75rem 1rem', marginBottom: '1rem', color: '#7a5b14', fontSize: '0.85rem',
        }}>
          {error}
        </div>
      )}

      <FormularioDemandaAmparo
        folio={folio}
        expediente={expediente}
        demandaExistente={demandaExistente}
        onSemaforoActualizado={setSemaforo}
      />
    </div>
  );
};