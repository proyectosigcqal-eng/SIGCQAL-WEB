import React from 'react';

import '../../../features/modulo-area-sustantiva/bitacora-historica-sustantiva/styles/BitacoraHistoricaSustantivaTimeline.css'; // Asegúrate de crear este archivo CSS para estilos

const BitacoraHistoricaSustantivaTimeline = ({ data }) => {
    // Función simple para formatear la fecha
    const formatearFecha = (fechaISO) => {
        const fecha = new Date(fechaISO);
        return fecha.toLocaleDateString('es-MX', { 
            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
        });
    };

    return (
        <div className="timeline-container">
            {data.map((evento, index) => (
                <div key={index} className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                        <div className="timeline-header">
                            <h4 className="event-title">{evento.tipoEvento}</h4>
                            <span className="event-date">{formatearFecha(evento.fecha)}</span>
                        </div>
                        <p className="event-description">{evento.descripcion || 'Sin detalles adicionales'}</p>
                        {evento.estatus && (
                            <span className="badge-status">{evento.estatus}</span>
                        )}
                        {evento.autorCompleto && (
                            <p className="event-author">Realizado por: <strong>{evento.autorCompleto}</strong></p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BitacoraHistoricaSustantivaTimeline;