import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { guardarSeguimiento, obtenerProximoFolio } from '../services/seguimientoService';
import { formatForBackend, formatTimeForBackend } from '@/shared/utils/dateUtils';

const FIRMANTE_FIJO = 5;

export const FormularioContestacionCorrespondencia = ({ acuse, correspondencia, onGuardado, onError }) => {
  const [folioGenerado, setFolioGenerado] = useState(null);
  const [folioPreview, setFolioPreview]   = useState(null);
  const [respuesta, setRespuesta]         = useState('');
  const [archivo, setArchivo]             = useState(null);
  const [guardando, setGuardando]         = useState(false);
  const [mostrarModalOficio, setMostrarModalOficio] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerProximoFolio()
      .then(folio => setFolioPreview(folio))
      .catch(() => setFolioPreview(null));
  }, []);

  const folioMostrar = folioGenerado ?? folioPreview;

  const handleArchivoChange = (e) => {
    const file = e.target.files[0];
    if (file?.type === 'application/pdf') {
      setArchivo(file);
    } else {
      onError && onError('Por favor, sube un archivo PDF válido.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!respuesta.trim()) {
      onError && onError('El informe de atención es obligatorio.');
      return;
    }
    setGuardando(true);
    try {
      const payload = {
  idCorrespondencia:                   acuse?.idCorrespondencia || correspondencia?.id,
  folioRespuesta:                      folioPreview || '',
  respuestaSeguimientoCorrespondencia: respuesta,
  fechaResolucion:                     formatForBackend(new Date()),
  horaResolucion:                      formatTimeForBackend(new Date()),
  archivoAdjunto:                      archivo ?? null,
  idUsuario:                           1,
  idEstatus:                           5,
  numeroOficioContestacion:            '',
};

      const seguimientoGuardado = await guardarSeguimiento(payload);

      setFolioGenerado(seguimientoGuardado?.folioFormateado ?? folioPreview);
      setMostrarModalOficio(true);
    } catch (err) {
      onError && onError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleGenerarOficio = () => {
    setMostrarModalOficio(false);
    navigate('/correspondencia/nuevo-oficio-contestacion', {
      state: {
        idCorrespondencia: acuse?.idCorrespondencia || correspondencia?.id || null,
        idUsuarioFirmante: FIRMANTE_FIJO,
        firmante:          'ana_admin',
        areaFirmante:      'Administración',
        idUsuarioEmisor:   FIRMANTE_FIJO,
        nombreEmisor:      'ana_admin',
        textoSugerido:     respuesta,
      }
    });
  };

  const handleNoOficio = () => {
    setMostrarModalOficio(false);
    onGuardado && onGuardado();
  };

  return (
    <>
      <form className="contestacion-form" onSubmit={handleSubmit}>

        <div className="input-group-custom">
          <label>Folio de Contestación</label>
          <div className="folio-preview-box">
            {folioMostrar ? (
              <>
                <span className="folio-prefix">CC-</span>
                <span className="folio-consecutivo">{folioMostrar.split('-')[1]}</span>
                <span className="folio-prefix">-{new Date().getFullYear()}</span>
                <span className="folio-auto-badge">{folioGenerado}</span>
              </>
            ) : (
              <span style={{ color: 'var(--muted-2)', fontSize: '0.9rem' }}>Calculando folio...</span>
            )}
          </div>
        </div>

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
          <div className="upload-icon">
            <span style={{ fontSize: 14 }}>⬆</span>
          </div>
          <div className="upload-text">
            <label className="fw-bold small text-uppercase">Oficio adjunto (opcional)</label>
            <p>{archivo ? archivo.name : 'Seleccionar archivo'}</p>
            <span>Solo archivos .pdf</span>
          </div>
          <input type="file" accept=".pdf" onChange={handleArchivoChange} />
        </div>
        {archivo && <p className="upload-success">✓ {archivo.name}</p>}

        <button type="submit" className="btn-enviar" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Enviar Contestación'}
        </button>

      </form>

      {mostrarModalOficio && (
        <div className="modal-overlay">
          <div className="modal-oficio-pregunta">
            <h3>✅ Contestación guardada</h3>
            <p>
              ¿Deseas generar un <strong>Oficio de Contestación</strong>{' '}
              vinculado a este trámite?
            </p>
            {folioGenerado && (
              <p style={{ fontSize: '0.85rem', color: 'var(--muted-2)', marginBottom: '16px' }}>
                Folio registrado: <strong>{folioGenerado}</strong>
              </p>
            )}
            <div className="modal-oficio-btns">
              <button className="btn-si-oficio" onClick={handleGenerarOficio}>
                Sí, generar oficio
              </button>
              <button className="btn-no-oficio" onClick={handleNoOficio}>
                No, continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};