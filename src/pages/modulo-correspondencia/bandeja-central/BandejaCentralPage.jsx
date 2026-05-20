import React, { useState, useEffect } from 'react';
import { listarSeguimientosMemo, listarSeguimientosCorr, listarSeguimientosOficio } from '../../../features/modulo-correspondencia/bandeja-central/services/bandejaService';
import { pickFecha, formatDateDisplay } from '@/shared/utils/dateUtils';
import DetalleBandejaModal from '../../../features/modulo-correspondencia/bandeja-central/components/DetalleBandejaModal';
import '../../../features/modulo-correspondencia/bandeja-central/styles/bandeja.css';
import axios from 'axios';
import API_BASE_URL from '@/shared/config/api';
import { listarOficios } from '../../../features/modulo-correspondencia/oficio/services/oficioService';
import { listarMemorandums } from '../../../features/modulo-correspondencia/memorandum/services/memorandumService';
import { listarCorrespondencias } from '../../../features/modulo-correspondencia/correspondencia/services/correspondenciaService';

export const BandejaCentralPage = () => {
    const [activeTab, setActiveTab] = useState('memorandums');
    const [datosTabla, setDatosTabla] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    
    // Switch de filtrado: true = con archivo, false = sin archivo
    const [verConArchivo, setVerConArchivo] = useState(true);

    useEffect(() => {
        cargarDatos(activeTab);
    }, [activeTab]);

   const normalizeId = (v) => v != null ? Number(v) : null;

  

const cargarDatos = async (tab) => {

  setIsLoading(true);
  try {
    const oficios = await listarOficios().catch(() => []);

    const tieneOficio = (idCorrespondencia) =>
    oficios.some(o => normalizeId(o.idCorrespondencia) === normalizeId(idCorrespondencia));



if (tab === 'memorandums') {

  const [data, memorandums] = await Promise.all([
    listarSeguimientosMemo(),
    listarMemorandums()
  ]);

  setDatosTabla(data.map(item => {
    // 1. Encuentra el memorándum original por idMemo
    const memoOriginal = memorandums.find(
        m => Number(m.id) === Number(item.idMemo) // ← usa m.id no m.idMemo
    );

    // 2. Con el idCorrespondencia del memo, busca si hay oficio de contestación
    const idCorrDelMemo = memoOriginal?.idCorrespondencia;
        const oficioContestacion = idCorrDelMemo
                ? oficios.find(o =>
                        Number(o.idCorrespondencia) === Number(idCorrDelMemo) &&
                        Number(o.id) !== Number(item.idMemo) &&
                        o.idArea === null // ← sin área = es contestación
                    )
                : null;

    return {
        id:                      item.idSeguimientoMemorandum,
        idMemo:                  item.idMemo,
        idCorrespondencia:       idCorrDelMemo || null,
        folio:                   item.folioRespuesta,
        asunto:                  item.respuestaSeguimientoMemorandum,
        fecha:                   pickFecha(item) || item.fechaResolucion,
        estatus:                 item.idEstatus === 6 ? 'CONCLUIDO' : 'CONTESTADO',
        archivo:                 oficioContestacion?.urlMemorandumGenerado || null,
        nombreArchivo:           oficioContestacion?.folioUnico || null,
        tieneOficioContestacion: !!oficioContestacion,
        tipo:                    'memorandum'
    };
}));

  } else if (tab === 'oficios') {
    const data = await listarSeguimientosOficio();

    // Oficios de contestación = los que tienen idArea null
    const oficiosContestacion = oficios.filter(o => o.idArea === null);

    setDatosTabla(data.map(item => {
        // Encuentra el oficio original del seguimiento
        const oficioOriginal = oficios.find(o => Number(o.id) === Number(item.idOficio));
        
        // Busca si existe un oficio de contestación con la misma correspondencia
                const oficioContest = oficioOriginal
                        ? oficiosContestacion.find(o =>
                                Number(o.idCorrespondencia) === Number(oficioOriginal.idCorrespondencia) &&
                                Number(o.id) !== Number(item.idOficio)
                            )
                        : null;

        return {
            id:                      item.idSeguimientoOficio,
            idMemo:                  item.idOficio,
            folio:                   item.folioRespuesta,
            asunto:                  item.respuestasSeguimientoOficio,
            fecha:                   pickFecha(item) || item.fechaResolucion,
            estatus:                 item.idEstatus === 6 ? 'CONCLUIDO' : 'CONTESTADO',
            archivo:                 oficioContest?.urlMemorandumGenerado || null,
            nombreArchivo:           oficioContest?.folioUnico || null,
            tieneOficioContestacion: !!oficioContest,
            tipo:                    'oficio'
        };
    }));
   } else {
  const [data, correspondencias] = await Promise.all([
    listarSeguimientosCorr(),
    listarCorrespondencias() // ← ya existe en correspondenciaService.js
  ]);

  setDatosTabla(data.map(item => {
    const corrOriginal = correspondencias.find(
      c => Number(c.id) === Number(item.idCorrespondencia)
    );

    const oficioContest = corrOriginal
      ? oficios.find(o =>
                    Number(o.idCorrespondencia) === Number(corrOriginal.id) &&
                    Number(o.id) !== Number(item.idMemo) &&
                    o.idArea === null
        )
      : null;

    return {
      id:                      item.idSeguimientoCorrespondencia,
      idMemo:                  item.idCorrespondencia,
      folio:                   item.folioRespuesta,
      asunto:                  item.respuestaSeguimientoCorrespondencia,
      fecha:                   pickFecha(item) || item.fechaResolucion,
      estatus:                 item.idEstatus === 6 ? 'CONCLUIDO' : 'CONTESTADO',
      archivo:                 oficioContest?.urlMemorandumGenerado || null,
      nombreArchivo:           oficioContest?.folioUnico || null,
      tieneOficioContestacion: !!oficioContest,
      tipo:                    'correspondencia'
    };
  }));
}
  } catch (error) {
    console.error("Error", error);
    setDatosTabla([]);
  } finally {
    setIsLoading(false);
  }
};
    // Lógica de filtrado excluyente
   const datosAMostrar = datosTabla.filter(item =>
    verConArchivo ? item.tieneOficioContestacion : !item.tieneOficioContestacion
);

    const handleAbrirDetalle = (item) => {
        setSelectedItem(item);
        setModalOpen(true);
    };

    const handleCerrarSeguimiento = async (item, comentario) => {
        try {
            if (!item) return;

            if (item.tipo === 'memorandum') {
                await axios.put(
                    `${API_BASE_URL}/seguimiento-memorandum/concluir/${item.id}`,
                    { respuestaSeguimientoMemorandum: comentario || 'Cierre desde bandeja' }
                );
            } else if (item.tipo === 'correspondencia') {
                await axios.put(
                    `${API_BASE_URL}/seguimiento-correspondencia/concluir/${item.id}`,
                    { respuestaSeguimientoCorrespondencia: comentario || 'Cierre desde bandeja' }
                );
            } else {
                await axios.put(
                    `${API_BASE_URL}/seguimiento-oficio/concluir/${item.id}`,
                    { respuestaSeguimientoOficio: comentario || 'Cierre desde bandeja' }
                );
            }

            setDatosTabla(prev =>
                prev.map(d => d.id === item.id ? { ...d, estatus: 'CONCLUIDO' } : d)
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
                <h1 className="bandeja-title">Bandeja de Contestación</h1>
                <p className="bandeja-subtitle">Gestiona y da seguimiento a los documentos asignados a tu área.</p>
            </div>

            <div className="bandeja-card">
                <div className="bandeja-tabs-container">
                    <button className={`bandeja-tab ${activeTab === 'memorandums' ? 'active' : ''}`} onClick={() => setActiveTab('memorandums')}>
                        📄 Memorándums
                    </button>
                    <button className={`bandeja-tab ${activeTab === 'correspondencia' ? 'active' : ''}`} onClick={() => setActiveTab('correspondencia')}>
                        📨 Correspondencia
                    </button>
                    <button className={`bandeja-tab ${activeTab === 'oficios' ? 'active' : ''}`} onClick={() => setActiveTab('oficios')}>
                        📋 Oficios
                    </button>
                </div>

                {/* Filtro Switch */}
                <div className="bandeja-filters-bar" style={{ padding: '1rem', display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid #e2e8f0' }}>
                    <div className="switch-container" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                       <span className="switch-label" style={{ fontWeight: '600' }}>
                        {verConArchivo ? '📋 Con oficio de contestación' : '📋 Sin oficio de contestación'}
                    </span>
                        <label className="switch">
                            <input 
                                type="checkbox" 
                                checked={verConArchivo} 
                                onChange={(e) => setVerConArchivo(e.target.checked)} 
                            />
                            <span className="slider round"></span>
                        </label>
                    </div>
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
                                {datosAMostrar.length > 0 ? (
                                    datosAMostrar.map((item, index) => (
                                        <tr key={index}>
                                            <td className="folio-cell">{item.folio}</td>
                                            <td>{item.asunto}</td>
                                                                    <td>{formatDateDisplay(item.fecha)}</td>
                                            <td>
                                                <span className={`status-badge ${
                                                    item.estatus === 'PENDIENTE'  ? 'status-pendiente'  :
                                                    item.estatus === 'CONCLUIDO'  ? 'status-concluido'  :
                                                    item.estatus === 'CONTESTADO' ? 'status-contestado' :
                                                    'status-seguimiento'
                                                }`}>
                                                    {item.estatus}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                                                                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                                                                                                    <button className="btn-atender" onClick={() => handleAbrirDetalle(item)}>
                                                                                                        Detalles
                                                                                                    </button>
                                                                                                    {item.tieneOficioContestacion && item.archivo && (
                                                                                                        <button
                                                                                                            className="btn-descargar-oficio"
                                                                                                            onClick={() => window.open(`${API_BASE_URL}${item.archivo}`, '_blank')}
                                                                                                            title="Ver Oficio de Contestación"
                                                                                                        >
                                                                                                            📄 Ver Oficio
                                                                                                        </button>
                                                                                                    )}
                                                                                                </div>
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