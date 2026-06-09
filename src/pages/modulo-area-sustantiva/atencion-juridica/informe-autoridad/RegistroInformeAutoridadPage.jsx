import { useNavigate, useParams } from 'react-router-dom';
import { RegistroInformeAutoridadForm } from '@/features/modulo-area-sustantiva/atencion-juridica/informe-autoridad/components/RegistroInformeAutoridadForm';
import '@/features/modulo-area-sustantiva/atencion-juridica/informe-autoridad/styles/registroInformeAutoridad.css';
import '@/features/modulo-area-sustantiva/registroexpediente/styles/registroExpediente.css';

export const RegistroInformeAutoridadPage = () => {
  const navigate = useNavigate();
  const { folio } = useParams();

  return (
    <div className="informe-autoridad-page">
      <div className="informe-autoridad-header">
        <button type="button" className="btn-volver" onClick={() => navigate(-1)}>
          ← Atrás
        </button>
        <h1 className="informe-autoridad-title">Informe de Autoridad</h1>
        <div style={{ width: 100 }} />
      </div>

      <RegistroInformeAutoridadForm folio={folio} onSuccess={() => navigate(`/atencion-juridica/tramites-irl/${encodeURIComponent(folio)}`)} />
    </div>
  );
};
