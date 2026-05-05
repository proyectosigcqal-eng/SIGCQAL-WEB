import React, { useState } from 'react';
import '../styles/contestacion.css'; // Asegúrate de ajustar la ruta si es necesario

export const FormularioContestacion = ({ onSubmit, isLoading }) => {
    const [respuestaSeguimiento, setRespuestaSeguimiento] = useState('');
    // Dejo el estado del folio por si acaso te dicen que sí se ocupa hoy, si no, lo puedes borrar.
    const [folioRespuesta, setFolioRespuesta] = useState(''); 

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!respuestaSeguimiento.trim()) {
            alert('El informe de atención es obligatorio para concluir el trámite.');
            return;
        }
        
        onSubmit({ 
            folioRespuesta, 
            respuestaSeguimiento 
        });
    };

    return (
        <form onSubmit={handleSubmit} className="custom-card p-4 h-100 d-flex flex-column">
            <div className="alert alert-info mb-4 border-0" style={{ backgroundColor: '#e2e8f0', color: '#2d3748' }}>
                <i className="bi bi-info-circle-fill me-2"></i>
                Describe las acciones tomadas. Este mensaje se registrará como la resolución oficial del memorándum y se enviará a la bandeja correspondiente.
            </div>

            {/* Opcional: Oculta este div si en la revisión te confirman que no hay folio de salida */}
            <div className="mb-4">
                <label className="form-label-custom">Folio de Salida (Si aplica):</label>
                <input 
                    type="text" 
                    className="form-control form-control-custom" 
                    placeholder="Ej. S/F o Número de control interno"
                    value={folioRespuesta}
                    onChange={(e) => setFolioRespuesta(e.target.value)}
                />
            </div>

            <div className="mb-4 flex-grow-1">
                <label className="form-label-custom text-primary fw-bold">Mensaje de Resolución / Informe de Atención:</label>
                <textarea 
                    className="form-control form-control-custom" 
                    rows="10"
                    placeholder="Redacta aquí la respuesta o conclusión del trámite..."
                    value={respuestaSeguimiento}
                    onChange={(e) => setRespuestaSeguimiento(e.target.value)}
                    required
                    style={{ resize: 'none' }} // Evita que deformen el diseño
                ></textarea>
            </div>

            <button 
                type="submit" 
                className="btn-guinda w-100 mt-auto shadow-sm"
                disabled={isLoading}
            >
                {isLoading ? (
                    <span><i className="spinner-border spinner-border-sm me-2"></i> Enviando Respuesta...</span>
                ) : (
                    <span>Enviar Respuesta y Concluir Trámite</span>
                )}
            </button>
        </form>
    );
};