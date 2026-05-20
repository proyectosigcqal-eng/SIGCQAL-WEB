import React, { useState, useEffect } from 'react';
import { obtenerBitacoraCompletaMemo, obtenerBitacoraCompletaOficio } from '../services/bandejaService';
import { obtenerBitacoraCompletaCorrespondencia } from '../services/bandejaService';
import '../styles/detalleBandejaModal.css';
import { formatDateTimeDisplay } from '@/shared/utils/dateUtils';
import API_BASE_URL, { fileUrl } from '@/shared/config/api';

// Mapa visual por estatus
const ESTATUS_CONFIG = {
  'CORRESPONDENCIA RECIBIDA': { color: '#2b6cb0', bg: '#ebf8ff', icon: '📬' },
  'MEMORANDUM GENERADO':     { color: '#3182ce', bg: '#ebf8ff', icon: '📝' },
  'VALIDADO':       { color: '#38a169', bg: '#f0fff4', icon: '✅' },
  'ASIGNADO':       { color: '#d69e2e', bg: '#fffff0', icon: '📋' },
  'REASIGNADO':     { color: '#dd6b20', bg: '#fffaf0', icon: '🔄' },
  'EN SEGUIMIENTO': { color: '#805ad5', bg: '#faf5ff', icon: '👁️' },
  'CONTESTADO':       { color: '#2b6cb0', bg: '#ebf8ff', icon: '📨' },
  'CONCLUIDO':      { color: '#276749', bg: '#f0fff4', icon: '🏁' },
  'OFICIO GENERADO': { color: '#6b46c1', bg: '#faf5ff', icon: '📋' },
};

const formatFecha = (fecha) => {
  return formatDateTimeDisplay(fecha);
};

export default function DetalleBandejaModal({ isOpen, onClose, item, onCerrarSeguimiento }) {
  const [logs, setLogs]               = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [comentario, setComentario]   = useState('');
  const [cerrando, setCerrando]       = useState(false);
  const [yaConcluido, setYaConcluido] = useState(false);

 useEffect(() => {
    if (!isOpen || !item) return;
    console.log('>>> item completo:', item);
    setYaConcluido(item.estatus === 'CONCLUIDO' || item.estatus === 'CERRADO');
const cargar = async () => {
    setLoadingLogs(true);
    try {
        if (item.tipo === 'memorandum') {
            const data = await obtenerBitacoraCompletaMemo(item.idMemo);
            setLogs(data || []);
        } else if (item.tipo === 'oficio') {
            const data = await obtenerBitacoraCompletaOficio(item.id, item.idMemo); // idMemo aquí es idOficio
            setLogs(data || []);
        } else {
            const data = await obtenerBitacoraCompletaCorrespondencia(item.idMemo);
  setLogs(data || []);
        }
    } catch (e) {
        console.error('Error bitácora:', e);
        setLogs([]);
    } finally {
        setLoadingLogs(false);
    }
};

    cargar();
    return () => setLogs([]);
}, [isOpen, item]);
  const archivoUrl = item?.archivoAdjunto || item?.archivo || null;

  const handleDescargarAdjunto = async () => {
  if (!archivoUrl) return;
  
  try {
    const respuesta = await fetch(archivoUrl);
    const blob = await respuesta.blob(); 
    const urlLocal = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = urlLocal;
    link.download = `OficioContestacion-${item.folio || 'doc'}.pdf`;
    document.body.appendChild(link);
    link.click();
    
    window.URL.revokeObjectURL(urlLocal);
    link.remove();
  } catch (error) {
    window.open(archivoUrl, '_blank');
  }
};

  const handleConcluir = async () => {
    if (!window.confirm('¿Confirmas marcar este trámite como CONCLUIDO?')) return;
    setCerrando(true);
    try {
      await onCerrarSeguimiento(item, comentario);
      setYaConcluido(true);
      setComentario('');
    } catch (e) {
      console.error(e);
      alert('Error al concluir el seguimiento.');
    } finally {
      setCerrando(false);
    }
  };

  if (!isOpen || !item) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-box">

        {/* HEADER */}
        <div className="modal-header">
          <div>
            <h3 className="modal-title">{item.folio || 'Detalle del trámite'}</h3>
            <span className="modal-tipo">
              {item.tipo === 'memorandum' ? '📄 Memorándum' : 
              item.tipo === 'oficio'     ? '📋 Oficio' : 
                                            '📨 Correspondencia'}
          </span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✖</button>
        </div>

        {/* DATOS GENERALES */}
        <div className="modal-meta">
          <div className="meta-item">
            <span className="meta-label">Asunto</span>
            <span className="meta-value">{item.asunto || '-'}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Fecha</span>
            <span className="meta-value">{item.fecha ? formatFecha(item.fecha) : '-'}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Estatus actual</span>
            <span className={`status-badge-modal ${yaConcluido ? 'badge-concluido' : 'badge-activo'}`}>
              {yaConcluido ? '🏁 CONCLUIDO' : item.estatus}
            </span>
          </div>
        </div>

        {/* BITÁCORA TIMELINE */}
        <div className="modal-bitacora-section">
          <h4 className="bitacora-titulo">Historial del trámite</h4>

          {loadingLogs ? (
            <p className="bitacora-cargando">Cargando bitácora...</p>
          ) : logs.length === 0 ? (
            <p className="bitacora-vacia">No hay eventos registrados aún.</p>
          ) : (
            <div className="timeline">
              {logs.map((log, index) => {
                const cfg = ESTATUS_CONFIG[log.estatus] || { color: '#718096', bg: '#f7fafc', icon: '•' };
                const esUltimo = index === logs.length - 1;
                return (
                  <div key={log.idLog} className={`timeline-item ${esUltimo ? 'timeline-ultimo' : ''}`}>
                    {/* Línea vertical */}
                    <div className="timeline-linea">
                      <div className="timeline-punto" style={{ background: cfg.color }}>
                        <span className="timeline-icon">{cfg.icon}</span>
                      </div>
                      {!esUltimo && <div className="timeline-conector" />}
                    </div>

                    {/* Contenido */}
                    <div className="timeline-contenido" style={{ background: cfg.bg, borderLeft: `3px solid ${cfg.color}` }}>
                      <div className="timeline-header-row">
                        <span className="timeline-estatus" style={{ color: cfg.color }}>{log.estatus}</span>
                        {log.folio && <span className="timeline-folio">Folio: {log.folio}</span>}
                      </div>
                      <div className="timeline-meta">
                        <span>👤 {log.usuario}</span>
                        <span>🕐 {formatFecha(log.fecha)}</span>
                      </div>
                      {log.descripcion && (
                        <p className="timeline-descripcion">{log.descripcion}</p>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Nodo final: CONCLUIDO (solo si ya está concluido) */}
              {yaConcluido && (
                <div className="timeline-item">
                  <div className="timeline-linea">
                    <div className="timeline-punto" style={{ background: '#276749' }}>
                      <span className="timeline-icon">🏁</span>
                    </div>
                  </div>
                  <div className="timeline-contenido" style={{ background: '#f0fff4', borderLeft: '3px solid #276749' }}>
                    <span className="timeline-estatus" style={{ color: '#276749' }}>CONCLUIDO</span>
                    <p className="timeline-descripcion">Trámite archivado y concluido.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

       {item.archivo && (
  <div
    className="modal-download-btns"
    style={{ justifyContent: 'center', padding: '0 0 8px', marginTop: 0 }}
  >
    <a
      href={fileUrl(item.archivo)}
      target="_blank"
      rel="noreferrer"
      className="btn-descargar"
    >
      📥 Descargar Oficio Contestación
    </a>
  </div>
)}

        {/* ACCIÓN: CONCLUIR (solo si no está concluido) */}
        {!yaConcluido && (
          <div className="modal-accion-section">
            <label className="accion-label">Comentario de cierre (opcional)</label>
            <textarea
              className="accion-textarea"
              rows={3}
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Observaciones finales antes de concluir el trámite..."
            />
            <div className="modal-footer-btns">
              <button className="btn-cancelar" onClick={onClose}>Cancelar</button>
              <button
                className="btn-concluir"
                onClick={handleConcluir}
                disabled={cerrando}
              >
                {cerrando ? 'Procesando...' : '🏁 Marcar como CONCLUIDO'}
              </button>
            </div>
          </div>
        )}

        {/* Si ya está concluido solo botón cerrar */}
        {yaConcluido && (
          <div className="modal-footer-btns" style={{ padding: '0 0 8px' }}>
            <button className="btn-cancelar" onClick={onClose}>Cerrar</button>
          </div>
        )}

      </div>
    </div>
  );
}