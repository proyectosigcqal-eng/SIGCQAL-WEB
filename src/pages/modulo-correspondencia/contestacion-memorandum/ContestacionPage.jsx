import { useParams, useNavigate } from 'react-router-dom';
import { useContestacion } from '../../../features/modulo-correspondencia/contestacion-memorandum/hooks/useContestacion';
import { VistaDocumentoOriginal } from '../../../features/modulo-correspondencia/contestacion-memorandum/components/VistaDocumentoOriginal';
import { FormularioContestacion } from '../../../features/modulo-correspondencia/contestacion-memorandum/components/FormularioContestacion';
import { guardarSeguimientoMemorandum } from '../../../features/modulo-correspondencia/contestacion-memorandum/services/contestacionService';
import { useState } from 'react';
import '../../../features/modulo-correspondencia/contestacion-memorandum/styles/contestacion.css';

export const ContestacionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { acuse, memorandum, loading, error: errorCarga } = useContestacion(id);
  const [errorForm, setErrorForm] = useState(null);

  const handleGuardado = () => {
    navigate('/correspondencia/bandeja');
  };

  return (
    <div className="contestacion-page">
      <div className="page-header-box">
        <h2>Seguimiento de Memorándum</h2>
        <p className="text-muted">Gestión de respuesta y cierre de folio institucional.</p>
      </div>

      {(errorCarga || errorForm) && (
        <div className="alert alert-danger mx-4">{errorCarga || errorForm}</div>
      )}

      <div className="split-layout">
        <section className="card-container">
          <div className="card-title-bar">
            <span>📄</span>
            <h5>Documento Original de Instrucción</h5>
          </div>
          <div className="form-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <VistaDocumentoOriginal memorandum={memorandum} loading={loading} />
          </div>
        </section>

        <section className="card-container">
          <div className="card-title-bar">
            <span>📝</span>
            <h5>Formulario de Captura de Respuesta</h5>
          </div>
          {!loading && acuse && (
            <FormularioContestacion
              acuse={acuse}
              memorandum={memorandum}
              onGuardado={handleGuardado}
              onError={setErrorForm}
            />
          )}
        </section>
      </div>
    </div>
  );
};