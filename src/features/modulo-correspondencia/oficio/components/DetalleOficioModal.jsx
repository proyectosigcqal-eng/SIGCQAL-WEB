import { useEffect, useState } from 'react';
import { obtenerOficioPorId } from '../services/oficioService';
import { responderAcuse } from '../../acuserecibointerno/services/acuserecibointernoService';
import '../styles/detalleOficioModal.css';

export const DetalleOficioModal = ({ idOficio, onClose, onActualizarLista }) => {
  const [oficio, setOficio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [respondiendo, setRespondiendo] = useState(false);

  useEffect(() => {
    if (!idOficio) return;
    setLoading(true);
    obtenerOficioPorId(idOficio)
      .then(data => {
        setOficio(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Error al cargar el oficio');
        setLoading(false);
      });
  }, [idOficio]);

  if (!idOficio) return null;

  const fecha = oficio?.fechaEmision ? new Date(oficio.fechaEmision) : null;
  const fechaStr = fecha ? fecha.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-';
  const horaStr = fecha ? fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : '-';

  const handleSiEsDelArea = async () => {
    if (!oficio || respondiendo) return;

    try {
      setRespondiendo(true);
      const now = new Date();
      const request = {
        idAcuse: oficio.idAcuse || oficio.id,
        esDelArea: true,
        fechaAceptacion: now.toISOString().split('T')[0],
        horaAceptacion: now.toTimeString().slice(0, 8),
        idUsuarioRevisor: oficio.idUsuarioRevisor || 1,
        idOficio: oficio.idOficio || oficio.id,
        idCorrespondencia: oficio.idCorrespondencia,
        numOficio: oficio.numOficio || oficio.folioUnico,
        fechaEmision: oficio.fechaEmision,
        idUsuarioEmisor: oficio.idUsuarioEmisor,
        folioUnico: oficio.folioUnico,
        observaciones: oficio.observaciones,
        urlOficioGenerado: oficio.urlOficioGenerado,
        idPlantilla: oficio.idPlantilla,
        idArea: oficio.idArea,
        idUsuarioFirmante: oficio.idUsuarioFirmante
      };

      await responderAcuse(request);
      alert('Acuse de recibo confirmado correctamente');
      if (onActualizarLista) onActualizarLista();
      if (onClose) onClose();
    } catch (error) {
      console.error('Error al responder acuse:', error);
      alert('Error al confirmar el acuse de recibo');
    } finally {
      setRespondiendo(false);
    }
  };

  const handleNoEsDelArea = async () => {
    if (!oficio || respondiendo) return;
    try {
      setRespondiendo(true);
      const now = new Date();
      const request = {
        idAcuse: oficio.idAcuse || oficio.id,
        esDelArea: false,
        fechaAceptacion: now.toISOString().split('T')[0],
        horaAceptacion: now.toTimeString().slice(0, 8),
        idUsuarioRevisor: oficio.idUsuarioRevisor || 1,
        idOficio: oficio.idOficio || oficio.id,
        idCorrespondencia: oficio.idCorrespondencia,
        numOficio: oficio.numOficio || oficio.folioUnico,
        fechaEmision: oficio.fechaEmision,
        idUsuarioEmisor: oficio.idUsuarioEmisor,
        folioUnico: oficio.folioUnico,
        observaciones: oficio.observaciones,
        urlOficioGenerado: oficio.urlOficioGenerado,
        idPlantilla: oficio.idPlantilla,
        idArea: oficio.idArea,
        idUsuarioFirmante: oficio.idUsuarioFirmante
      };
      await responderAcuse(request);
      alert('Se notificó que NO es del área.');
      if (onActualizarLista) onActualizarLista();
      if (onClose) onClose();
    } catch (error) {
      console.error('Error al responder acuse (no es del área):', error);
      alert('Error al notificar que no es del área');
    } finally {
      setRespondiendo(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        {loading ? (
          <div className="modal-loading">Cargando...</div>
        ) : error ? (
          <div className="modal-error">{error}</div>
        ) : (
          <div className="detalle-memorandum">
            <h2>Detalles  Del Oficio <span>{oficio.folioUnico || oficio.id}</span></h2>
            <div className="detalle-grid">
              <div>
                    <strong>FOLIO OFICIO</strong> {oficio.folioUnico || oficio.id || '-'}
                </div>
                <div>
                    <strong>ÁREA</strong> {oficio.idArea || '-'}
                </div>

                <div>
                    <strong>FECHA EMISIÓN</strong>
                    <div>{fechaStr}</div>
                </div>
                <div>
                    <strong>HORA EMISIÓN</strong>
                    <div>{horaStr}</div>
                </div>
              <div className="info-correspondencia">
                <strong>REMITENTE</strong>
                <div>{oficio.remitente || oficio.nombreRemitente || oficio.remitenteNombre || '-'}</div>
              </div>
              <div className="info-correspondencia">
                <strong>DEPENDENCIA</strong>
                <div>{oficio.dependenciaRemitente || oficio.dependencia || oficio.nombreDependencia || '-'}</div>
              </div>
              <div className="info-correspondencia">
                <strong>ASUNTO </strong>
                <div>{oficio.asuntoCorrespondencia || oficio.asunto || '-'}</div>
              </div>
              <div className="info-correspondencia">
                <strong>FOLIO CORRESPONDENCIA</strong>
                <div>{oficio.folioUnicoCorrespondencia || oficio.folioCorrespondencia || '-'}</div>
              </div>
                <div>
                    <strong>USUARIO EMISOR</strong>
                    <div>{oficio.nombreUsuarioEmisor || '-'}</div>
                </div>
                <div>
                    <strong>USUARIO FIRMANTE</strong>
                    <div>{oficio.nombreUsuarioFirmante || '-'}</div>
                </div>
                <div>
                    <strong>INSTRUCCIÓN SEGUIMIENTO</strong>
                    <div>{oficio.instruccionSeguimiento || '-'}</div>
                </div>
                <div className="detalle-contenido">
                    <strong>CONTENIDO</strong>
                    <div>{oficio.observaciones || '-'}</div>
                </div>
                </div>
            <div className="detalle-botones">
              <button 
                className="btn-si" 
                onClick={handleSiEsDelArea}
                disabled={respondiendo}
              >
                {respondiendo ? 'Confirmando...' : 'Si es del área.'}
              </button>
              <button className="btn-no" onClick={handleNoEsDelArea}>No es del área</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
