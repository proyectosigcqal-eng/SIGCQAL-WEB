import React, { useEffect, useState } from 'react';
import { useContestacionCorrespondencia } from '../hooks/useContestacionCorrespondencia';
import '../styles/contestacion.css';

export const FormularioContestacion = ({ idCorrespondencia, onSuccess, onCancel }) => {
  const { correspondencia, isLoading, error, cargarDetalle, registrarContestacion } = useContestacionCorrespondencia();
  const [folioRespuesta, setFolioRespuesta] = useState('');
  const [respuestaSeguimiento, setRespuestaSeguimiento] = useState('');
  const [archivoAdjunto, setArchivoAdjunto] = useState(null);

  useEffect(() => {
    if (idCorrespondencia) {
      cargarDetalle(idCorrespondencia);
    }
  }, [idCorrespondencia, cargarDetalle]);

  const detalle = correspondencia || {};
  const folioUnico = detalle.folio_unico || detalle.folioUnico || '-';
  const asunto = detalle.asunto || '-';
  const nombreRemitente =
    detalle.nombre_remitente ||
    detalle.nombreRemitente ||
    detalle.remitente ||
    detalle.titularDependencia ||
    '-';
  const dependenciaRemitente = detalle.dependencia_remitente || detalle.dependenciaRemitente || '-';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!respuestaSeguimiento.trim()) {
      alert('El informe de atención es obligatorio para concluir el trámite.');
      return;
    }

    if (!archivoAdjunto) {
      alert('Debes adjuntar el oficio firmado en PDF.');
      return;
    }

    const result = await registrarContestacion({
      idCorrespondencia,
      folioRespuesta,
      respuestaSeguimiento,
      archivoAdjunto,
    });

    if (result.success) {
      alert('Contestación guardada correctamente.');
      onSuccess();
    } else {
      alert(result.message || 'No se pudo guardar la contestación.');
    }
  };

  return (
    <div className="contestacion-page">
      <div className="page-header-box">
        <h2>Seguimiento de Correspondencia</h2>
        <p className="text-muted">Gestión de respuesta y cierre de folio institucional.</p>
      </div>

      <div className="split-layout">
        <section className="card-container">
          <div className="card-title-bar">
            <span>📄</span>
            <h5>Correspondencia Original</h5>
          </div>

          <div className="form-body">
            {isLoading && !correspondencia ? (
              <p className="text-muted mb-0">Cargando información de la correspondencia...</p>
            ) : (
              <div className="space-y-3">
                <p><strong>Folio único:</strong> {folioUnico}</p>
                <p><strong>Asunto:</strong> {asunto}</p>
                <p><strong>Nombre remitente:</strong> {nombreRemitente}</p>
                <p><strong>Dependencia remitente:</strong> {dependenciaRemitente}</p>
              </div>
            )}
          </div>
        </section>

        <section className="card-container">
          <div className="card-title-bar">
            <span>📝</span>
            <h5>Formulario de Captura de Respuesta</h5>
          </div>

          <form className="form-body" onSubmit={handleSubmit}>
            <div className="input-group-custom">
              <label>Folio de Respuesta</label>
              <input
                type="text"
                className="form-input-styled"
                placeholder="Ej. RESP-2026-001"
                value={folioRespuesta}
                onChange={(e) => setFolioRespuesta(e.target.value)}
              />
            </div>

            <div className="input-group-custom">
              <label>Respuesta de seguimiento</label>
              <textarea
                className="form-input-styled"
                rows="6"
                placeholder="Describe la resolución de esta correspondencia..."
                value={respuestaSeguimiento}
                onChange={(e) => setRespuestaSeguimiento(e.target.value)}
                required
              />
            </div>

            <div className="input-group-custom">
              <label>Carga de Oficio Firmado (PDF)</label>
              <input
                type="file"
                accept=".pdf"
                className="form-input-styled"
                onChange={(e) => setArchivoAdjunto(e.target.files?.[0] || null)}
              />
            </div>

            {error ? <p className="text-danger mb-3">{error}</p> : null}

            <div className="d-flex gap-2">
              <button type="submit" className="btn-submit-action shadow" disabled={isLoading}>
                {isLoading ? 'Guardando...' : 'CONCLUIR Y GUARDAR SEGUIMIENTO'}
              </button>
              <button type="button" className="btn btn-outline-secondary w-100" onClick={onCancel}>
                Cancelar
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};
