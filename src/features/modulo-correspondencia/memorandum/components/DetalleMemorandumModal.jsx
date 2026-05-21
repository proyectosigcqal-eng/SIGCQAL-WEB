import { useEffect, useState } from 'react';
import { obtenerMemorandumPorId } from '../services/memorandumService';
import { responderAcuse } from '../../acuserecibointerno/services/acuserecibointernoService';
import { formatForBackend, formatTimeForBackend, formatDateDisplay, formatDateTimeDisplay } from '@/shared/utils/dateUtils';
import '../styles/detalleMemorandumModal.css';

export const DetalleMemorandumModal = ({ idMemo, onClose, onActualizarLista }) => {
  const [memo, setMemo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [respondiendo, setRespondiendo] = useState(false);

 useEffect(() => {
  if (!idMemo) return;
  setLoading(true);
  obtenerMemorandumPorId(idMemo)
    .then(data => {
      console.log('>>> memo completo keys:', Object.keys(data)); // ← ver campos reales
      console.log('>>> memo completo:', data);
      setMemo(data);
      setLoading(false);
    })
    .catch(err => {
      setError('Error al cargar el memorándum');
      setLoading(false);
    });
}, [idMemo]);

  if (!idMemo) return null;


// Reemplaza el bloque de fecha/hora en DetalleMemorandumModal.jsx

const fecha = memo?.fechaEmision 
  ?? memo?.fecha_emision 
  ?? memo?.fechaCreacion 
  ?? memo?.createdAt 
  ?? null;

const fechaStr = fecha 
  ? formatDateDisplay(fecha) 
  : memo?.urlMemorandumGenerado  // si tiene archivo, al menos sabemos que fue procesado
    ? 'Fecha no registrada' 
    : '-';

const horaStr = fecha
  ? fecha.includes('T') 
    ? fecha.split('T')[1].substring(0, 5)
    : '-'
  : '-';

  // Función para manejar la respuesta "Si es del área"
  const handleSiEsDelArea = async () => {
    if (!memo || respondiendo) return;

    try {
      setRespondiendo(true);
      
      const now = new Date();
      const request = {
        idAcuse: memo.idAcuse || memo.id,
        esDelArea: true,
        fechaAceptacion: formatForBackend(now),
        horaAceptacion: formatTimeForBackend(now),
        idUsuarioRevisor: memo.idUsuarioRevisor || 1, // Ajustar según el usuario logueado
        idMemorandum: memo.idMemorandum || memo.id,
        idCorrespondencia: memo.idCorrespondencia,
        numMemo: memo.numMemo || memo.folioUnico,
        fechaEmision: memo.fechaEmision,
        idUsuarioEmisor: memo.idUsuarioEmisor,
        folioUnico: memo.folioUnico,
        observaciones: memo.observaciones,
        urlMemorandumGenerado: memo.urlMemorandumGenerado,
        idPlantilla: memo.idPlantilla,
        idArea: memo.idArea,
        idUsuarioFirmante: memo.idUsuarioFirmante
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
    if (!memo || respondiendo) return;
    try {
      setRespondiendo(true);
      const now = new Date();
      const request = {
        idAcuse: memo.idAcuse || memo.id,
        esDelArea: false,
        fechaAceptacion: formatForBackend(now),
        horaAceptacion: formatTimeForBackend(now),
        idUsuarioRevisor: memo.idUsuarioRevisor || 1, // Ajustar según el usuario logueado
        idMemorandum: memo.idMemorandum || memo.id,
        idCorrespondencia: memo.idCorrespondencia,
        numMemo: memo.numMemo || memo.folioUnico,
        fechaEmision: memo.fechaEmision,
        idUsuarioEmisor: memo.idUsuarioEmisor,
        folioUnico: memo.folioUnico,
        observaciones: memo.observaciones,
        urlMemorandumGenerado: memo.urlMemorandumGenerado,
        idPlantilla: memo.idPlantilla,
        idArea: memo.idArea,
        idUsuarioFirmante: memo.idUsuarioFirmante
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
            <h2>Detalles  Del Memorandum <span>{memo.folioUnico || memo.id}</span></h2>
            <div className="detalle-grid">
              {/* Información de Correspondencia Vinculada */}
              <div>
                    <strong>FOLIO MEMORANDUM</strong> {memo.folioUnico || memo.id || '-'}
                </div>
                <div>
                    <strong>ÁREA</strong> {memo.idArea || '-'}
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
                <div>{memo.nombreRemitente || memo.remitente || '-'}</div>
              </div>
              <div className="info-correspondencia">
                <strong>DEPENDENCIA</strong>
                <div>{memo.dependenciaRemitente || memo.dependencia || '-'}</div>
              </div>
              <div className="info-correspondencia">
                <strong>ASUNTO </strong>
                <div>{memo.asuntoCorrespondencia || memo.asunto || '-'}</div>
              </div>
              <div className="info-correspondencia">
                <strong>FOLIO CORRESPONDENCIA</strong>
                <div>{memo.folioUnicoCorrespondencia || memo.folioCorrespondencia || '-'}</div>
              </div>
                <div>
                    <strong>USUARIO EMISOR</strong>
                    <div>{memo.nombreUsuarioEmisor || '-'}</div>
                </div>
                <div>
                    <strong>USUARIO FIRMANTE</strong>
                    <div>{memo.nombreUsuarioFirmante || '-'}</div>
                </div>
                <div>
                    <strong>INSTRUCCIÓN SEGUIMIENTO</strong>
                    <div>{memo.instruccionSeguimiento || '-'}</div>
                </div>
                <div className="detalle-contenido">
                    <strong>CONTENIDO</strong>
                    <div>{memo.observaciones || '-'}</div>
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
