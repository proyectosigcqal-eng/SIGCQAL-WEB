import { SemaforoPlazo } from '@/features/modulo-area-sustantiva/atencion-juridica/prevencion/components/SemaforoPlazo';
import { SemaforoPlazoInformeAutoridad } from '@/features/modulo-area-sustantiva/atencion-juridica/informe-autoridad/components/SemaforoPlazoInformeAutoridad';
import { ESTATUS_OFICIO_ENVIADO } from '@/features/modulo-area-sustantiva/atencion-juridica/informe-autoridad/constants';

export const TarjetaEstatusLateral = ({ folio, estatusActual, progresoPorcentaje, onVerDocumentos }) => (
  <div className="ficha-lateral-card">
    <div className="ficha-lateral-label">ESTATUS ACTUAL</div>
    <div className="ficha-lateral-estatus">{estatusActual}</div>

    {/* --- AQUÍ AGREGAMOS LA CONDICIÓN Y EL SEMÁFORO --- */}
    {estatusActual?.toUpperCase().includes('PREVENCI') && (
      <div style={{ marginTop: '12px', marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
        <SemaforoPlazo folio={folio} />
      </div>
    )}

    {estatusActual?.toUpperCase().includes(ESTATUS_OFICIO_ENVIADO) && (
      <div style={{ marginTop: '12px', marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
        <SemaforoPlazoInformeAutoridad folio={folio} />
      </div>
    )}

    <div className="ficha-progress-bar">
      <div
        className="ficha-progress-fill"
        style={{ width: `${progresoPorcentaje}%` }}
      />
    </div>

    <button className="ficha-btn-documentos" onClick={onVerDocumentos}>
      VER DOCUMENTOS
    </button>
  </div>
);
