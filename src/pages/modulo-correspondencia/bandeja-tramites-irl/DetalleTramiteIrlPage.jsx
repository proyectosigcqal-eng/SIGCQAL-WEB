import { useNavigate, useParams } from 'react-router-dom';
import '@/features/modulo-correspondencia/bandeja-tramites-irl/styles/bandejaTramitesIrl.css';

export default function DetalleTramiteIrlPage() {
  const navigate = useNavigate();
  const { folioId } = useParams();

  return (
    <div className="irl-bandeja-wrapper">
      <div className="irl-bandeja-header">
        <h1 className="irl-bandeja-title">Ficha del trámite</h1>
        <p className="irl-bandeja-subtitle">{folioId ? decodeURIComponent(folioId) : '-'}</p>
      </div>

      <div className="irl-card">
        <div className="irl-table-wrap">
          <div className="irl-state">Detalle extendido pendiente de integración con backend.</div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="button" className="irl-btn irl-btn-secondary" onClick={() => navigate(-1)}>
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

