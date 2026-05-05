import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Importamos los servicios de los demás!
//import { obtenerBandejaPorArea } from '../../features/modulo-correspondencia/memorandum/services/memorandumService';
// import { obtenerCorrespondenciaExterna } from '../../features/.../correspondenciaService'; 

import '../../../features/modulo-correspondencia/bandeja-central/styles/bandeja.css'; 
export const BandejaCentralPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('memorandums');
    const [datosTabla, setDatosTabla] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Cada que cambia la pestaña, vamos al servicio correspondiente
    useEffect(() => {
        cargarDatos(activeTab);
    }, [activeTab]);

    const cargarDatos = async (tab) => {
        setIsLoading(true);
        try {
            if (tab === 'memorandums') {
                // Descomentar cuando el back esté listo:
                // const acuses = await obtenerBandejaPorArea(ID_DEL_AREA);
                // setDatosTabla(acuses);
                
                // MOCK para probar el diseño:
                setDatosTabla([
                    { id: 1, folio: 'MEM-2026-001', asunto: 'Revisión de Servidores', fecha: '04/05/2026', estatus: 'EN SEGUIMIENTO' },
                    { id: 2, folio: 'MEM-2026-042', asunto: 'Aprobación de Presupuesto', fecha: '03/05/2026', estatus: 'PENDIENTE' }
                ]);
            } else if (tab === 'correspondencia') {
                // Descomentar cuando el back esté listo:
                // const externos = await obtenerCorrespondenciaExterna(ID_DEL_AREA);
                // setDatosTabla(externos);
                
                // MOCK para probar el diseño:
                setDatosTabla([
                    { id: 10, folio: 'CORR-EXT-089', asunto: 'Notificación de Auditoría', fecha: '02/05/2026', estatus: 'PENDIENTE' }
                ]);
            }
        } catch (error) {
            console.error("Error al cargar la información", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAtenderClick = (id) => {
        // Redirige al formulario de contestación correspondiente
        if (activeTab === 'memorandums') {
            navigate(`/memorandum/seguimiento/${id}`); 
        } else {
            navigate(`/correspondencia/seguimiento/${id}`);
        }
    };

    return (
        <div className="bandeja-wrapper">
            <div className="bandeja-header">
                <h1 className="bandeja-title">Bandeja de Trámites</h1>
                <p className="bandeja-subtitle">Gestiona y da seguimiento a los documentos asignados a tu área.</p>
            </div>

            <div className="bandeja-card">
                {/* Navegación de Pestañas Personalizada */}
                <div className="bandeja-tabs-container">
                    <button 
                        className={`bandeja-tab ${activeTab === 'memorandums' ? 'active' : ''}`}
                        onClick={() => setActiveTab('memorandums')}
                    >
                        📄 Memorándums Internos
                    </button>
                    <button 
                        className={`bandeja-tab ${activeTab === 'correspondencia' ? 'active' : ''}`}
                        onClick={() => setActiveTab('correspondencia')}
                    >
                        📨 Correspondencia Externa
                    </button>
                </div>

                {/* Contenido Dinámico */}
                <div className="bandeja-content">
                    {isLoading ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#a0aec0' }}>
                            <p>Cargando información...</p>
                        </div>
                    ) : (
                        <table className="bandeja-table">
                            <thead>
                                <tr>
                                    <th>Folio Único</th>
                                    <th>Asunto / Instrucción</th>
                                    <th>Fecha</th>
                                    <th>Estatus</th>
                                    <th style={{ textAlign: 'center' }}>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {datosTabla.length > 0 ? (
                                    datosTabla.map((item, index) => (
                                        <tr key={index}>
                                            <td className="folio-cell">{item.folio}</td>
                                            <td>{item.asunto}</td>
                                            <td>{item.fecha}</td>
                                            <td>
                                                <span className={`status-badge ${item.estatus === 'PENDIENTE' ? 'status-pendiente' : 'status-seguimiento'}`}>
                                                    {item.estatus}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <button 
                                                    className="btn-atender"
                                                    onClick={() => handleAtenderClick(item.id)}
                                                >
                                                    Atender / Detalles
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#a0aec0' }}>
                                            No hay documentos pendientes en esta categoría.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};