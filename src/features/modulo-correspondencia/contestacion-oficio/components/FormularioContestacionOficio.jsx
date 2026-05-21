import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrarSeguimiento } from '../../oficio/services/oficioService';
import '../styles/contestacion-oficio.css';

const FIRMANTE_FIJO = 5; // ana_admin

export const FormularioContestacionOficio = ({ acuse, oficio, onGuardado, onError }) => {
  const navigate = useNavigate();
  const [respuesta, setRespuesta]                   = useState('');
  const [archivo, setArchivo]                       = useState(null);
  const [guardando, setGuardando]                   = useState(false);
  const [folioGenerado, setFolioGenerado]           = useState(null);
  const [folioManual, setFolioManual]               = useState('');
  const [mostrarModalOficio, setMostrarModalOficio] = useState(false);
  const [idCorrespondencia, setIdCorrespondencia]   = useState(null);

  const handleArchivoChange = (e) => {
    const file = e.target.files[0];
    if (file?.type === 'application/pdf') {
      setArchivo(file);
    } else {
      onError && onError('Por favor, sube un PDF válido.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!respuesta) {
      onError && onError('El informe de atención es obligatorio.');
      return;
    }
    setGuardando(true);
    try {
      const idOficio = acuse?.idOficio || acuse?.id || acuse?.id_oficio;
      if (!idOficio) throw new Error('No se encontró id de oficio en el acuse');

      const datos = {
        respuestaSeguimiento: respuesta,
        archivoAdjunto:       archivo || null,
        idUsuario:            1, // ← fijo, sin depender de numeroUsuario
        idEstatus:            5,
      };

      const seguimientoResp = await registrarSeguimiento(idOficio, datos);
      setFolioGenerado(seguimientoResp?.folioRespuesta ?? '');
      if (!folioManual) setFolioManual(seguimientoResp?.folioRespuesta ?? '');
      // Resolver idCorrespondencia a partir del acuse o del oficio
      const resolvedIdCorr = acuse?.idCorrespondencia ?? oficio?.idCorrespondencia ?? acuse?.id ?? oficio?.id ?? null;
      setIdCorrespondencia(resolvedIdCorr || null);
      setMostrarModalOficio(true);

    } catch (err) {
      onError && onError(err.message || 'Error al guardar seguimiento de oficio');
    } finally {
      setGuardando(false);
    }
  };

  const handleGenerarOficio = () => {
    setMostrarModalOficio(false);
    navigate('/correspondencia/nuevo-oficio-contestacion', {
      state: {
        idCorrespondencia: Number(idCorrespondencia) || null,
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
            <label className="fw-bold small text-uppercase">Archivo adjunto (opcional)</label>
            <p>{archivo ? archivo.name : 'Seleccionar archivo'}</p>
            <span>Solo archivos .pdf</span>
          </div>
          <input type="file" accept=".pdf" onChange={handleArchivoChange} />
        </div>
        {archivo && <p className="upload-success">✓ {archivo.name}</p>}

        <button type="submit" className="btn-enviar" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Enviar Contestación (Oficio)'}
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
              <p style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '16px' }}>
                Folio registrado: <strong>{folioGenerado}</strong>
              </p>
            )}
            {/* Campo 'Folio para Oficio (manual)' eliminado por requerimiento */}
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