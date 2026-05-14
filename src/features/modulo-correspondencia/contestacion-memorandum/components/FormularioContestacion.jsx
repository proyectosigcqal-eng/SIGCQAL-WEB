import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { guardarSeguimientoMemorandum, subirPdfFirmado, obtenerProximoFolio } from '../services/contestacionService'; // ← import agregado

const FIRMANTE_FIJO = 5; // ana_admin

export const FormularioContestacion = ({ acuse, memorandum, onGuardado, onError }) => {
  const [folioGenerado, setFolioGenerado] = useState(null);
  const [folioPreview, setFolioPreview]   = useState(null); // ← agregado
  const [respuesta, setRespuesta]         = useState('');
  const [archivo, setArchivo]             = useState(null);
  const [guardando, setGuardando]         = useState(false);
  const [mostrarModalOficio, setMostrarModalOficio] = useState(false);
  const [idCorrespondencia, setIdCorrespondencia]   = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerProximoFolio()
      .then(folio => setFolioPreview(folio))
      .catch(() => setFolioPreview(null));
  }, []);

  const folioMostrar = folioGenerado ?? folioPreview; // ← agregado

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
    setGuardando(true);
    try {
      const payload = {
        idMemo:                         acuse.idMemorandum,
        respuestaSeguimientoMemorandum: respuesta,
        fechaResolucion:                new Date().toISOString().split('T')[0],
        horaResolucion:                 new Date().toTimeString().split(' ')[0],
        archivoAdjunto:                 archivo?.name ?? null,
        idUsuario:                      1,
        idEstatus:                      5,
      };

      const seguimientoGuardado = await guardarSeguimientoMemorandum(payload);

      if (archivo && seguimientoGuardado?.idSeguimientoMemorandum) {
        await subirPdfFirmado(seguimientoGuardado.idSeguimientoMemorandum, archivo);
      }

      setFolioGenerado(seguimientoGuardado?.folioFormateado ?? folioPreview);

      // Guardamos el idCorrespondencia para heredarlo al oficio
      setIdCorrespondencia(acuse?.idCorrespondencia || null);

      // Mostramos el modal para preguntar si se desea generar un oficio
      setMostrarModalOficio(true);
    } catch (err) {
      onError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleGenerarOficio = () => {
    setMostrarModalOficio(false);
    navigate('/correspondencia/nuevo-oficio-contestacion', {
      state: {
        idCorrespondencia,
        memorandum,
        idUsuarioFirmante: FIRMANTE_FIJO,
        firmante:          'ana_admin',
        areaFirmante:      'Administración',
        textoSugerido:     respuesta,
        folioOficio:       folioGenerado || folioPreview || ''
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
              <span className="folio-auto-badge">
                {folioGenerado}
              </span>
            </>
          ) : (
            <span style={{ color: '#a0aec0', fontSize: '0.9rem' }}>Calculando folio...</span>
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

      {/* Modal ¿Generar Oficio de Contestación? */}
      {mostrarModalOficio && (
        <div className="modal-overlay">
          <div className="modal-oficio-pregunta">
            <h3>✅ Contestación guardada</h3>
            <p>
              ¿Deseas generar un <strong>Oficio de Contestación Interna</strong>{' '}
              vinculado a este trámite?
            </p>
            {folioGenerado && (
              <p style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '16px' }}>
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