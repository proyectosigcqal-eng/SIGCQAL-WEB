// src/features/modulo-correspondencia/bitacora-historica/pages/BitacoraHistorica.jsx
import React, { useState, useEffect } from 'react';
import { obtenerBitacoraPorCorrespondencia } from '../services/bitacoraService';
import { DetalleEventoModal } from '../components/DetalleEventoModal';
import '../styles/bitacora.css';
import { useParams } from 'react-router-dom';

export const BitacoraHistorica = ({ idCorrespondencia }) => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const { id } = useParams();

  useEffect(() => {
  const fetchBitacora = async () => {
    try {
      const data = await obtenerBitacoraPorCorrespondencia(id);
     
      setHistorial(data || []); 
    } catch (error) {
      console.error("Error al cargar:", error);
      setHistorial([]);
    } finally {
      setLoading(false); 
    }
  };
  fetchBitacora();
}, [id]);

  const formatearFecha = (fechaString) => {
    if (!fechaString) return '';
    const date = new Date(fechaString);
    return date.toISOString().split('T')[0]; 
  };

  if (loading) return <div className="p-4">Cargando bitácora histórica...</div>;

  if (!historial || historial.length === 0) {
    return (
      <div className="empty-state">
        <h3>Bitácora Histórica</h3>
        <p>No existe información histórica disponible para este documento.</p>
      </div>
    );
  }

  return (
    <div className="bitacora-container">
      <div className="bitacora-header">
        <span className="breadcrumb">Bitácora Histórica</span>
        <h1>Bitácora Histórica</h1>
      </div>

      <div className="timeline-container">
        {historial.map((log, index) => (
          <div className="timeline-item" key={log.idLog}>
            <div className="timeline-dot"></div>
        
            {index !== historial.length - 1 && <div className="timeline-line"></div>}
            
            <div className="timeline-card">
              <div className="timeline-content">
                <h3 className="timeline-title">
                  EVT-{log.idLog.toString().padStart(3, '0')} — {log.nombreEstatusNuevo}
                </h3>
                <p className="timeline-meta">
                  {formatearFecha(log.fechaMovimiento)} • Usuario: {log.nombreUsuario || 'Sistema'} • Dependencia: {log.dependenciaRemitente || 'N/A'}
                </p>
              </div>
              <button 
                className="btn-detalles"
                onClick={() => setEventoSeleccionado(log)}
              >
                Ver Detalles
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="export-container">
        <button className="btn-exportar">Exportar timeline (PDF)</button>
      </div>

      {eventoSeleccionado && (
        <DetalleEventoModal 
          evento={eventoSeleccionado} 
          onClose={() => setEventoSeleccionado(null)} 
        />
      )}
    </div>
  );
};