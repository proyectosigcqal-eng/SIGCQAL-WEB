import React, { useState, useEffect } from 'react';
// navegación no usada aquí
import { listarSeguimientosMemo, listarSeguimientosCorr, guardarSeguimientoMemo, guardarSeguimientoCorr } from '../../../features/modulo-correspondencia/bandeja-central/services/bandejaService';
import DetalleBandejaModal from '../../../features/modulo-correspondencia/bandeja-central/components/DetalleBandejaModal';
import '../../../features/modulo-correspondencia/bandeja-central/styles/bandeja.css';
import axios from 'axios';

export const BandejaCentralPage = () => {
    // no usamos navegación directa desde la bandeja; abrimos modal en su lugar
    const [activeTab, setActiveTab] = useState('memorandums');
    const [datosTabla, setDatosTabla] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        cargarDatos(activeTab);
    }, [activeTab]);

   const cargarDatos = async (tab) => {
    setIsLoading(true);
    try {
        if (tab === 'memorandums') {
            // Traemos los datos de la tabla seguimiento_memorandum
            const data = await listarSeguimientosMemo();
             console.log('>>> data del back:', data);
            
            setDatosTabla(data.map(item => ({
            id:      item.idSeguimientoMemorandum,  
            idMemo:  item.idMemo,
            folio:   item.folioRespuesta,
            asunto:  item.respuestaSeguimientoMemorandum,
            fecha:   item.fechaResolucion,
            estatus: item.idEstatus === 6 ? 'CONCLUIDO' : 'CONTESTADO',
            archivo: item.archivoAdjunto,
            tipo:    'memorandum'
        })));
        } else {
            // Traemos los datos de la tabla seguimiento_correspondencia
            const data = await listarSeguimientosCorr();
            setDatosTabla(data.map(item => ({
                id:      item.idSeguimientoMemorandum,  // ← ID único del seguimiento
                idMemo:  item.idMemo,
                folio:   item.folioRespuesta,
                asunto:  item.respuestaSeguimientoMemorandum,
                fecha:   item.fechaResolucion,
                estatus: item.idEstatus === 6 ? 'CONCLUIDO' : 'CONTESTADO', // ← leer del back
                archivo: item.archivoAdjunto,
                tipo:    'memorandum'
            })));
        }
    } catch (error) {
        console.error("Error", error);
        setDatosTabla([]);
    } finally {
        setIsLoading(false);
    }
};
    const handleAbrirDetalle = (item) => {
        setSelectedItem(item);
        setModalOpen(true);
    };

  const handleCerrarSeguimiento = async (item, comentario) => {
    try {
        if (!item) return;

        if (item.tipo === 'memorandum') {
            // ← PUT al nuevo endpoint, NO guardarSeguimientoMemo
            await axios.put(
                `http://localhost:8081/SIGCQAL_dev/api/v1/seguimiento-memorandum/concluir/${item.id}`,
                { respuestaSeguimientoMemorandum: comentario || 'Cierre desde bandeja' }
            );
        } else {
            await axios.put(
                `http://localhost:8081/SIGCQAL_dev/api/v1/seguimiento-correspondencia/concluir/${item.id}`,
                { respuestaSeguimientoCorrespondencia: comentario || 'Cierre desde bandeja' }
            );
        }

        setDatosTabla(prev =>
            prev.map(d =>
                d.id === item.id ? { ...d, estatus: 'CONCLUIDO' } : d
            )
        );
        return true;
    } catch (error) {
        console.error('Error al cerrar:', error);
        throw error;
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
                                               <span className={`status-badge ${
                                                item.estatus === 'PENDIENTE'   ? 'status-pendiente'  :
                                                item.estatus === 'CONCLUIDO'   ? 'status-concluido'  :
                                                item.estatus === 'CONTESTADO'  ? 'status-contestado' :
                                                                                'status-seguimiento'
                                            }`}>
                                                {item.estatus}
                                            </span>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <button
                                                    className="btn-atender"
                                                    onClick={() => handleAbrirDetalle(item)}
                                                >
                                                    Detalles
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
                    {selectedItem && (
                        <DetalleBandejaModal
                            isOpen={modalOpen}
                            onClose={() => { setModalOpen(false); setSelectedItem(null); }}
                            item={selectedItem}
                            onCerrarSeguimiento={async (it, comentario) => {
                                await handleCerrarSeguimiento(it, comentario);
                                setModalOpen(false);
                                setSelectedItem(null);
                            }}
                        />
                    )}
        </div>
    );
};