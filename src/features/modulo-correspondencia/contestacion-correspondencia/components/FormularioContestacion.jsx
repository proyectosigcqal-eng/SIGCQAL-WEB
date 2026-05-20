import { useState, useEffect } from 'react';
import { useContestacionCorrespondencia } from '../hooks/useContestacionCorrespondencia';
import { VistaDocumentoCorrespondencia } from './VistaDocumentoCorrespondencia'; 
import '../styles/contestacion_correspondencia.css';

export const FormularioContestacion = ({ idCorrespondencia, onSuccess, onCancel }) => {
  const { correspondencia, isLoading, error, cargarDetalle, registrarContestacion } = useContestacionCorrespondencia();
  const [respuesta, setRespuesta] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (idCorrespondencia) cargarDetalle(idCorrespondencia);
  }, [idCorrespondencia, cargarDetalle]);

  // Manejador de archivo externo y validado
  const handleArchivoChange = (e) => {
    const file = e.target.files[0];
    if (file?.type === 'application/pdf') {
      setArchivo(file);
    } else {
      alert('Por favor, sube un archivo PDF válido.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!respuesta.trim()) return alert('El informe es obligatorio.');
    
    setGuardando(true);
    const result = await registrarContestacion({
      idCorrespondencia,
      folioRespuesta: 'AUTO', 
      respuestaSeguimiento: respuesta,
      archivoAdjunto: archivo,
    });

    if (result.success) {
      onSuccess();
    } else {
      alert(result.message || 'Error al guardar.');
    }
    setGuardando(false);
  };

  return (
    <div className="contestacion-page">
      <div className="split-layout">
        {/* LADO IZQUIERDO: Visualización (Consistente) */}
        <section className="card-container">
          <VistaDocumentoCorrespondencia correspondencia={correspondencia} loading={isLoading} />
        </section>

        {/* LADO DERECHO: Formulario (Diseño unificado) */}
        <section className="card-container">
          <form className="contestacion-form" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="fw-bold small text-uppercase">Informe de Atención</label>
              <textarea
                className="form-control"
                rows={5}
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
                placeholder="Describa las acciones tomadas..."
              />
            </div>

            <div className="upload-box">
              <div className="upload-text">
                <label className="fw-bold small text-uppercase">Oficio adjunto</label>
                <p>{archivo ? archivo.name : 'Seleccionar archivo'}</p>
              </div>
              <input type="file" accept=".pdf" onChange={handleArchivoChange} />
            </div>

            {error && <p className="text-danger small mt-2">{error}</p>}

            <button type="submit" className="btn-enviar" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Enviar Contestación'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};