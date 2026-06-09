import { SemaforoPlazoInformeAutoridad } from './SemaforoPlazoInformeAutoridad';
import { useRegistroInformeAutoridad } from '../hooks/useRegistroInformeAutoridad';
import '@/features/modulo-area-sustantiva/registroexpediente/styles/registroExpediente.css';
import '../styles/registroInformeAutoridad.css';

export const RegistroInformeAutoridadForm = ({ folio, onSuccess }) => {
  const {
    fechaRecepcion,
    setFechaRecepcion,
    numeroOficioRespuesta,
    setNumeroOficioRespuesta,
    fojas,
    setFojas,
    archivoPdf,
    handleArchivoChange,
    isSubmitting,
    error,
    successMessage,
    isValid,
    submit,
  } = useRegistroInformeAutoridad({ folio, onSuccess });

  return (
    <div className="informe-autoridad-card">
      {error && <div className="informe-autoridad-alert">{error}</div>}
      {successMessage && <div className="informe-autoridad-success">{successMessage}</div>}

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
        <SemaforoPlazoInformeAutoridad folio={folio} />
      </div>

      <div className="form-section">
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">RECEPCIÓN Y REGISTRO DE INFORME DE AUTORIDAD</h2>
          </div>
          <div className="section-body">
            <div className="form-grid">
              <div className="form-group">
                <label>FECHA DE RECEPCIÓN DEL INFORME</label>
                <input type="date" value={fechaRecepcion} onChange={(e) => setFechaRecepcion(e.target.value)} />
              </div>

              <div className="form-group">
                <label>NÚMERO DE OFICIO DE RESPUESTA</label>
                <input value={numeroOficioRespuesta} onChange={(e) => setNumeroOficioRespuesta(e.target.value)} />
              </div>

              <div className="form-group">
                <label>FOJAS</label>
                <input
                  type="number"
                  min="1"
                  value={fojas}
                  onChange={(e) => setFojas(e.target.value)}
                  inputMode="numeric"
                />
              </div>

              <div className="form-group full-width">
                <label>CARGAR INFORME FIRMADO (PDF)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleArchivoChange(e.target.files?.[0] ?? null)}
                />
                {archivoPdf?.name && <div className="informe-autoridad-file-name">{archivoPdf.name}</div>}
              </div>
            </div>

            <div className="informe-autoridad-actions">
              <button
                type="button"
                className="informe-autoridad-submit"
                disabled={!isValid || isSubmitting}
                onClick={submit}
              >
                GUARDAR INFORME Y CONCLUIR REQUERIMIENTO
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

