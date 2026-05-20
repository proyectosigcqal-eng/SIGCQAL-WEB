import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormularioContestacionCorrespondencia } from '../../../features/modulo-correspondencia/contestacion-correspondencia/components/FormularioContestacion';
import { VistaDocumentoCorrespondencia } from '../../../features/modulo-correspondencia/contestacion-correspondencia/components/VistaDocumentoCorrespondencia';
import { useContestacionCorrespondencia } from '../../../features/modulo-correspondencia/contestacion-correspondencia/hooks/useContestacionCorrespondencia';
import '../../../features/modulo-correspondencia/contestacion-correspondencia/styles/contestacion_correspondencia.css';

export const ContestacionCorrespondenciaPage = () => {
  const navigate = useNavigate();
  const { correspondencia, loading, error: errorCarga } = useContestacionCorrespondencia();
  const [errorForm, setErrorForm] = useState(null);

  const handleGuardado = () => navigate('/correspondencia/bandeja');

  return (
    <div className="contestacion-page">
      <div className="page-header-box">
        <h2>Seguimiento de Correspondencia</h2>
        <p className="text-muted">Gestión de respuesta y cierre de folio institucional.</p>
      </div>

      {(errorCarga || errorForm) && (
        <div className="alert alert-danger mx-4" style={{ marginBottom: '20px' }}>
          {errorCarga || errorForm}
        </div>
      )}

      <div className="split-layout">
        <section className="card-container">
          <div className="card-title-bar">
            <span>📄</span>
            <h5>Documento Original de Correspondencia</h5>
          </div>
          <div className="form-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <VistaDocumentoCorrespondencia
              correspondencia={correspondencia}
              loading={loading}
            />
          </div>
        </section>

        <section className="card-container">
          <div className="card-title-bar">
            <span>📝</span>
            <h5>Formulario de Captura de Respuesta</h5>
          </div>
          <div className="form-body">
            {!loading && correspondencia && (
              <FormularioContestacionCorrespondencia
                acuse={{ idCorrespondencia: correspondencia.id }}
                correspondencia={correspondencia}
                onGuardado={handleGuardado}
                onError={setErrorForm}
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
};