import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarSeguimientosMemo, listarSeguimientosCorr } from '../../../features/modulo-correspondencia/bandeja-central/services/bandejaService';
import '../../../features/modulo-correspondencia/bandeja-central/styles/bandeja.css';

export const BandejaCentralPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('memorandums');
    const [datosTabla, setDatosTabla] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        cargarDatos(activeTab);
    }, [activeTab]);

    const cargarDatos = async (tab) => {
        setIsLoading(true);
        try {
            if (tab === 'memorandums') {
                const data = await listarSeguimientosMemo();
                // Mapeamos la respuesta del DTO al formato que espera la tabla
                setDatosTabla(data.map(item => ({
                    id: item.idMemorandum,          // viene de SeguimientoMemorandumResponseDTO
                    folio: item.folio ?? `MEM-${item.idMemorandum}`,
                    asunto: item.asunto ?? item.descripcion,
                    fecha: item.fecha ?? item.fechaRegistro,
                    estatus: item.estatus ?? 'PENDIENTE'
                })));
            } else if (tab === 'correspondencia') {
                const data = await listarSeguimientosCorr();
                // Mapeamos la respuesta del DTO al formato que espera la tabla
                setDatosTabla(data.map(item => ({
                    id: item.idCorrespondencia,     // viene de SeguimientoCorrespondenciaResponseDTO
                    folio: item.folio ?? `CORR-${item.idCorrespondencia}`,
                    asunto: item.asunto ?? item.descripcion,
                    fecha: item.fecha ?? item.fechaRegistro,
                    estatus: item.estatus ?? 'PENDIENTE'
                })));
            }
        } catch (error) {
            console.error("Error al cargar la información", error);
            setDatosTabla([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAtenderClick = (id) => {
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
                <div className="bandeja-tabs-container">
                    <button
                        className={`bandeja-tab ${activeTab === 'memorandums' ? 'active' : ''}`}
                        onClick={() => setActiveTab('memorandums')}
                    >
                        📄 Memorándums
                    </button>
                    <button
                        className={`bandeja-tab ${activeTab === 'correspondencia' ? 'active' : ''}`}
                        onClick={() => setActiveTab('correspondencia')}
                    >
                        📨 Correspondencia
                    </button>
                </div>

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