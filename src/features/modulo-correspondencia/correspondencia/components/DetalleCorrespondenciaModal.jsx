import { useEffect, useState } from 'react';
import { obtenerCorrespondenciaPorId } from '../services/correspondenciaService';
import { crearAcuseCorrespondencia } from '../../acusecorrespondencia/services/acusecorrespondenciaService';
import '../styles/detalleCorrespondenciaModal.css';

export const DetalleCorrespondenciaModal = ({ idCorrespondencia, onClose }) => {
  const [correspondencia, setCorrespondencia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [respondiendo, setRespondiendo] = useState(false);

  useEffect(() => {
    if (!idCorrespondencia) return;
    setLoading(true);
    obtenerCorrespondenciaPorId(idCorrespondencia)
      .then(data => {
        setCorrespondencia(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Error al cargar la correspondencia');
        setLoading(false);
      });
  }, [idCorrespondencia]);

  if (!idCorrespondencia) return null;

  const fechaExpedicion = correspondencia?.fechaExpedicion ? new Date(correspondencia.fechaExpedicion) : null;
  const fechaExpedicionStr = fechaExpedicion ? fechaExpedicion.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }) : '-';

  // Función para manejar la respuesta "Si es del área"
  const handleSiEsDelArea = async () => {
    if (!correspondencia || respondiendo) return;

    try {
      setRespondiendo(true);

      const request = {
        idCorrespondencia: correspondencia.id,
        idUsuarioRevisor: 1, // TODO: Obtener del usuario logueado
        esDelArea: true
      };

      await crearAcuseCorrespondencia(request);
      alert('Acuse de correspondencia confirmado correctamente');
      if (onClose) onClose();
    } catch (error) {
      console.error('Error al responder acuse de correspondencia:', error);
      alert('Error al confirmar el acuse de correspondencia');
    } finally {
      setRespondiendo(false);
    }
  };

  const handleNoEsDelArea = async () => {
    if (!correspondencia || respondiendo) return;

    try {
      setRespondiendo(true);

      const request = {
        idCorrespondencia: correspondencia.id,
        idUsuarioRevisor: 1, // TODO: Obtener del usuario logueado
        esDelArea: false
      };

      await crearAcuseCorrespondencia(request);
      alert('Se notificó que NO es del área.');
      if (onClose) onClose();
    } catch (error) {
      console.error('Error al responder acuse de correspondencia (no es del área):', error);
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
          <div className="detalle-correspondencia">
            <h2>Detalles de la Correspondencia <span>{correspondencia.folioUnico || correspondencia.id}</span></h2>

            <div className="detalle-grid">
                <div>
                <strong>FOLIO ÚNICO</strong>
                <div>{correspondencia.folioUnico || correspondencia.id || '-'}</div>
                </div>

                <div>
                <strong>NÚMERO DE OFICIO</strong>
                <div>{correspondencia.numeroOficio || correspondencia.nroOficio || '-'}</div>
                </div>

                <div>
                <strong>FECHA EXPEDICIÓN</strong>
                <div>{fechaExpedicionStr}</div>
                </div>

                <div>
                <strong>DEPENDENCIA REMITENTE</strong>
                <div>{correspondencia.dependenciaRemitente || '-'}</div>
                </div>

                <div>
                <strong>TITULAR DEPENDENCIA</strong>
                <div>{correspondencia.titularDependencia || '-'}</div>
                </div>

                <div>
                <strong>NOMBRE ÁREA</strong>
                <div>{correspondencia.nombreArea || '-'}</div>
                </div>

                <div className="detalle-asunto">
                <strong>ASUNTO</strong>
                <div>{correspondencia.asunto || '-'}</div>
                </div>

                <div className="detalle-observaciones">
                <strong>OBSERVACIONES</strong>
                <div>{correspondencia.observaciones || '-'}</div>
                </div>
            </div>

            <div className="detalle-botones">
                <button
                className="btn-si"
                onClick={handleSiEsDelArea}
                disabled={respondiendo}
                >
                {respondiendo ? 'Confirmando...' : 'Si es del área'}
                </button>

                <button
                className="btn-no"
                onClick={handleNoEsDelArea}
                disabled={respondiendo}
                >
                No es del área
                </button>
            </div>
            </div>
        )}
      </div>
    </div>
  );
};