import { useParams, useNavigate } from 'react-router-dom';
import { useContestacionOficio } from '../../../features/modulo-correspondencia/contestacion-oficio/hooks/useContestacionOficio';
import { VistaDocumentoOriginalOficio } from '../../../features/modulo-correspondencia/contestacion-oficio/components/VistaDocumentoOriginalOficio';
import { FormularioContestacionOficio } from '../../../features/modulo-correspondencia/contestacion-oficio/components/FormularioContestacionOficio';
import '../../../features/modulo-correspondencia/contestacion-memorandum/styles/contestacion.css';

export const ContestacionOficioPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { acuse, oficio, loading, error } = useContestacionOficio(id);

  const handleGuardado = () => {
    navigate('/correspondencia/bandeja');
  };

  return (
    <div className="contestacion-page">
      <div className="page-header-box">
        <h2>Seguimiento de Oficio</h2>
        <p className="text-muted">Gestión de respuesta y cierre de oficio institucional.</p>
      </div>

      {error && <div className="alert alert-danger mx-4">{error}</div>}

      <div className="split-layout">
        <section className="card-container">
          <div className="card-title-bar">
            <span>📄</span>
            <h5>Documento Original</h5>
          </div>
          <div className="form-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <VistaDocumentoOriginalOficio oficio={oficio} loading={loading} />
          </div>
        </section>

        <section className="card-container">
          <div className="card-title-bar">
            <span>📝</span>
            <h5>Formulario de Captura de Respuesta</h5>
          </div>
          {!loading && acuse && (
            <FormularioContestacionOficio
              acuse={acuse}
              oficio={oficio}
              onGuardado={handleGuardado}
              onError={() => {}}
            />
          )}
        </section>
      </div>
    </div>
  );
};
