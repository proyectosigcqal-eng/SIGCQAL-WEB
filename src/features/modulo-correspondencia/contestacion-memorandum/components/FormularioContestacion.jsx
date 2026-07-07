import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { guardarSeguimientoMemorandum, subirPdfFirmado, obtenerProximoFolio } from '../services/contestacionService';
import { formatForBackend, formatTimeForBackend } from '@/shared/utils/dateUtils';
import { useAuth } from '@/shared/context/AuthContext';

export const FormularioContestacion = ({ acuse, memorandum, onGuardado, onError }) => {
  const [folioGenerado, setFolioGenerado] = useState(null);
  const [folioPreview, setFolioPreview]   = useState(null);
  const [respuesta, setRespuesta]         = useState('');
  const [archivo, setArchivo]             = useState(null);
  const [guardando, setGuardando]         = useState(false);
  const [mostrarModalOficio, setMostrarModalOficio] = useState(false);
  const [idCorrespondencia, setIdCorrespondencia]   = useState(null);
  const navigate    = useNavigate();
  const { session } = useAuth();

  const idUsuario = session?.idUsuario ?? session?.id ?? null;
  const nombre    = session?.username  ?? session?.nombre ?? null;

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
      onError('Por favor, sube un archivo PDF válido.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!respuesta) {
      onError('El informe de atención es obligatorio.');
      return;
    }
    if (!idUsuario) {
      onError('No se encontró sesión activa. Por favor inicia sesión nuevamente.');
      return;
    }
    setGuardando(true);
    try {
      const payload = {
        idMemo:                         acuse.idMemorandum,
        respuestaSeguimientoMemorandum: respuesta,
        fechaResolucion:                formatForBackend(new Date()),
        horaResolucion:                 formatTimeForBackend(new Date()),
        archivoAdjunto:                 archivo?.name ?? null,
        idUsuario,
        idEstatus: 5,
      };

      const seguimientoGuardado = await guardarSeguimientoMemorandum(payload);

      if (archivo && seguimientoGuardado?.idSeguimientoMemorandum) {
        await subirPdfFirmado(seguimientoGuardado.idSeguimientoMemorandum, archivo);
      }

      setFolioGenerado(seguimientoGuardado?.folioFormateado ?? folioPreview);
      setIdCorrespondencia(acuse?.idCorrespondencia || null);
      setMostrarModalOficio(true);
    } catch (err) {
      onError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleGenerarOficio = () => {
    setMostrarModalOficio(false);
    const resolvedIdCorrespondencia = acuse?.idCorrespondencia ?? memorandum?.idCorrespondencia ?? acuse?.id ?? memorandum?.id ?? null;
    navigate('/correspondencia/nuevo-oficio-contestacion', {
      state: {
        idCorrespondencia: Number(resolvedIdCorrespondencia) || null,
        idUsuarioFirmante: idUsuario,   // ← antes: FIRMANTE_FIJO
        idUsuarioEmisor:   idUsuario,   // ← antes: FIRMANTE_FIJO
        firmante:          nombre ?? '',
        areaFirmante:      'Administración',
        nombreEmisor:      nombre ?? '',
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
                <span className="folio-prefix">CM-</span>
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
              ¿Deseas generar un <strong>Oficio de Contestación Interna</strong>{' '}
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