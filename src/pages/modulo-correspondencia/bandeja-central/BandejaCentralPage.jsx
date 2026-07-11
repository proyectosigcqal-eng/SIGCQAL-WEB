import React, { useState, useEffect, useMemo } from 'react';
import { listarSeguimientosMemo, listarSeguimientosCorr, listarSeguimientosOficio } from '../../../features/modulo-correspondencia/bandeja-central/services/bandejaService';
import { pickFecha, formatDateDisplay } from '@/shared/utils/dateUtils';
import DetalleBandejaModal from '../../../features/modulo-correspondencia/bandeja-central/components/DetalleBandejaModal';
import '../../../features/modulo-correspondencia/bandeja-central/styles/bandeja.css';
import axios from 'axios';
import API_BASE_URL from '@/shared/config/api';
import { listarOficios } from '../../../features/modulo-correspondencia/oficio/services/oficioService';
import { listarMemorandums } from '../../../features/modulo-correspondencia/memorandum/services/memorandumService';
import { listarCorrespondencias } from '../../../features/modulo-correspondencia/correspondencia/services/correspondenciaService';

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE: Tab EN CURSO
// Muestra TODAS las correspondencias desde que se registran, con estatus, 
// usuario, fecha, filtros y bitácora. 100% independiente del tab CONTESTADO.
// ─────────────────────────────────────────────────────────────────────────────

const ESTATUS_LABELS = {
  1: 'REGISTRADO',
  2: 'VALIDADO',
  3: 'ASIGNADO',
  4: 'EN SEGUIMIENTO',
  5: 'CONTESTADO',
  6: 'CONCLUIDO',
};

const ESTATUS_COLORS = {
  REGISTRADO:      { bg: '#EBF8FF', color: '#2B6CB0', dot: '#3182CE' },
  VALIDADO:        { bg: '#F0FFF4', color: '#276749', dot: '#38A169' },
  ASIGNADO:        { bg: '#FFFFF0', color: '#744210', dot: '#D69E2E' },
  'EN SEGUIMIENTO':{ bg: '#FAF5FF', color: '#553C9A', dot: '#805AD5' },
  CONTESTADO:      { bg: '#EBF8FF', color: '#2B6CB0', dot: '#3182CE' },
  CONCLUIDO:       { bg: '#F0FFF4', color: '#276749', dot: '#38A169' },
};

const normalizeId = (val) => (val === null || val === undefined ? null : Number(val));

const EstatusBadge = ({ label }) => {
  const cfg = ESTATUS_COLORS[label] || { bg: '#F7FAFC', color: '#718096', dot: '#A0AEC0' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700,
      letterSpacing: '0.05em', background: cfg.bg, color: cfg.color,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.dot, display: 'inline-block' }} />
      {label}
    </span>
  );
};

// ── Lógica de carga de datos EN CURSO ────────────────────────────────────────
const cargarDatosEnCurso = async () => {
  const [correspondencias, memorandums, oficios,
         seguimientosCorr, seguimientosMemo, seguimientosOficio] =
    await Promise.all([
      listarCorrespondencias().catch(() => []),
      listarMemorandums().catch(() => []),
      listarOficios().catch(() => []),
      axios.get(`${API_BASE_URL}/seguimiento-correspondencia/listar`).then(r => r.data).catch(() => []),
      axios.get(`${API_BASE_URL}/seguimiento-memorandum/listar`).then(r => r.data).catch(() => []),
      axios.get(`${API_BASE_URL}/seguimiento-oficio/listar`).then(r => r.data).catch(() => []),
    ]);

  const rows = [];

  // ── CORRESPONDENCIAS ──────────────────────────────────────────────────────
  correspondencias.forEach(corr => {
    const segs = seguimientosCorr
      .filter(s => normalizeId(s.idCorrespondencia) === normalizeId(corr.id))
      .sort((a, b) => new Date(b.fechaRegistro || 0) - new Date(a.fechaRegistro || 0));

    const segReciente = segs[0] || null;
    let estatusId    = corr.idEstatus || 1;
    let fechaMostrar = corr.fechaRecibido || corr.fechaRegistro;
    // FIX 1: usuario viene del documento, no del seguimiento
    const usuarioMostrar = corr.nombreUsuarioCaptura   // ← usuario interno que capturó
  || corr.dependenciaRemitente                      // fallback: remitente externo
  || `Usuario ${corr.idUsuarioCaptura}`;

    if (segReciente) {
      estatusId    = segReciente.idEstatus || estatusId;
      fechaMostrar = pickFecha(segReciente) || segReciente.fechaResolucion || fechaMostrar;
      // ← ya NO sobreescribimos usuarioMostrar
    }

    const estatusLabel = ESTATUS_LABELS[estatusId] || `Estatus ${estatusId}`;
    // FIX 2: excluir terminados del tab EN CURSO
    if (estatusLabel === 'CONTESTADO' || estatusLabel === 'CONCLUIDO') return;

    rows.push({
      key:       `corr-${corr.id}`,
      tipo:      'correspondencia',
      tipoLabel: 'Correspondencia',
      tipoIcon:  '📨',
      folio:     corr.folioUnico,
      asunto:    corr.asunto || '-',
      estatus:   estatusLabel,
      fecha:     fechaMostrar,
      usuario:   usuarioMostrar,
      id:        segReciente?.idSeguimientoCorrespondencia || null,
      idMemo:    corr.id,
      idCorrespondencia: corr.id,
      archivo:   null,
      tieneOficioContestacion: false,
    });
  });

  // ── MEMORÁNDUMS ───────────────────────────────────────────────────────────
  memorandums.forEach(memo => {
    const segs = seguimientosMemo
      .filter(s => normalizeId(s.idMemo) === normalizeId(memo.id))
      .sort((a, b) => new Date(b.fechaRegistro || 0) - new Date(a.fechaRegistro || 0));

    const segReciente = segs[0] || null;
    let estatusId    = 3;
    let fechaMostrar = memo.fechaEmision;
    // FIX 1: nombre del emisor del memo
    const usuarioMostrar = memo.nombreUsuarioEmisor
      || memo.nombreUsuarioFirmante
      || `Usuario ${memo.idUsuarioEmisor}`;

    if (segReciente) {
      estatusId    = segReciente.idEstatus || estatusId;
      fechaMostrar = pickFecha(segReciente) || segReciente.fechaResolucion || fechaMostrar;
    }

    const estatusLabel = ESTATUS_LABELS[estatusId] || `Estatus ${estatusId}`;
    // FIX 2
    if (estatusLabel === 'CONTESTADO' || estatusLabel === 'CONCLUIDO') return;

    rows.push({
      key:       `memo-${memo.id}`,
      tipo:      'memorandum',
      tipoLabel: 'Memorándum',
      tipoIcon:  '📄',
      folio:     memo.folioUnico || memo.numMemo,
      asunto:    memo.asuntoCorrespondencia || memo.observaciones || '-',
      estatus:   estatusLabel,
      fecha:     fechaMostrar,
      usuario:   usuarioMostrar,
      id:        segReciente?.idSeguimientoMemorandum || null,
      idMemo:    memo.id,
      idCorrespondencia: memo.idCorrespondencia,
      archivo:   null,
      tieneOficioContestacion: false,
    });
  });

  // ── OFICIOS ───────────────────────────────────────────────────────────────
  oficios.forEach(oficio => {
    const segs = seguimientosOficio
      .filter(s => normalizeId(s.idOficio) === normalizeId(oficio.id))
      .sort((a, b) => new Date(b.fechaRegistro || 0) - new Date(a.fechaRegistro || 0));

    const segReciente = segs[0] || null;
    let estatusId    = 3;
    let fechaMostrar = oficio.fechaEmision;
    // FIX 1: nombre del emisor del oficio
    const usuarioMostrar = oficio.nombreUsuarioEmisor
      || oficio.nombreUsuarioFirmante
      || `Usuario ${oficio.idUsuarioEmisor}`;

    if (segReciente) {
      estatusId    = segReciente.idEstatus || estatusId;
      fechaMostrar = pickFecha(segReciente) || segReciente.fechaResolucion || fechaMostrar;
    }

    const estatusLabel = ESTATUS_LABELS[estatusId] || `Estatus ${estatusId}`;
    // FIX 2
    if (estatusLabel === 'CONTESTADO' || estatusLabel === 'CONCLUIDO') return;

    rows.push({
      key:       `oficio-${oficio.id}`,
      tipo:      'oficio',
      tipoLabel: 'Oficio',
      tipoIcon:  '📋',
      folio:     oficio.folioUnico || oficio.numMemo,
      asunto:    oficio.asuntoCorrespondencia || oficio.observaciones || '-',
      estatus:   estatusLabel,
      fecha:     fechaMostrar,
      usuario:   usuarioMostrar,
      id:        segReciente?.idSeguimientoOficio || null,
      idMemo:    oficio.id,
      idCorrespondencia: oficio.idCorrespondencia,
      archivo:   null,
      tieneOficioContestacion: false,
    });
  });

  return rows;
};

// ── Componente: Tab EN CURSO ──────────────────────────────────────────────────
const TabEnCurso = ({ onAbrirDetalle }) => {
  const [datos, setDatos]         = useState([]);
  const [loading, setLoading]     = useState(false);
  const [busqueda, setBusqueda]   = useState('');
  const [filtroTipo, setFiltroTipo]     = useState('TODOS');
  const [filtroEstatus, setFiltroEstatus] = useState('TODOS');

  const cargar = async () => {
    setLoading(true);
    try {
      const rows = await cargarDatosEnCurso();
      setDatos(rows);
    } catch (e) {
      console.error('Error cargando EN CURSO:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const datosFiltrados = useMemo(() => {
    return datos.filter(row => {
      const matchTipo    = filtroTipo === 'TODOS' || row.tipoLabel.toUpperCase() === filtroTipo;
      const matchEstatus = filtroEstatus === 'TODOS' || row.estatus === filtroEstatus;
      const q = busqueda.toLowerCase();
      const matchBusq   = !q ||
        (row.folio || '').toLowerCase().includes(q) ||
        (row.asunto || '').toLowerCase().includes(q) ||
        (row.usuario || '').toLowerCase().includes(q);
      return matchTipo && matchEstatus && matchBusq;
    });
  }, [datos, filtroTipo, filtroEstatus, busqueda]);

  const estatusUnicos = useMemo(() =>
    ['TODOS', ...new Set(datos.map(d => d.estatus))], [datos]);

  return (
    <div>
      {/* ── Barra de filtros ────────────────────────────────────────── */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 10, padding: '14px 16px',
        borderBottom: '1px solid #e2e8f0', alignItems: 'center',
        background: '#FAFBFC',
      }}>
        <input
          type="text"
          placeholder="Buscar por folio, asunto o usuario..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{
            flex: '1 1 220px', minWidth: 200, padding: '7px 12px',
            border: '1px solid #CBD5E0', borderRadius: 8, fontSize: 13,
            outline: 'none', background: '#fff',
          }}
        />

        <select
          value={filtroTipo}
          onChange={e => setFiltroTipo(e.target.value)}
          style={{
            padding: '7px 12px', border: '1px solid #CBD5E0', borderRadius: 8,
            fontSize: 13, background: '#fff', cursor: 'pointer',
          }}
        >
          <option value="TODOS">Todos los tipos</option>
          <option value="CORRESPONDENCIA">Correspondencia</option>
          <option value="MEMORÁNDUM">Memorándum</option>
          <option value="OFICIO">Oficio</option>
        </select>

        <select
          value={filtroEstatus}
          onChange={e => setFiltroEstatus(e.target.value)}
          style={{
            padding: '7px 12px', border: '1px solid #CBD5E0', borderRadius: 8,
            fontSize: 13, background: '#fff', cursor: 'pointer',
          }}
        >
          {estatusUnicos.map(e => (
            <option key={e} value={e}>{e === 'TODOS' ? 'Todos los estatus' : e}</option>
          ))}
        </select>

        <button
          onClick={cargar}
          style={{
            padding: '7px 16px', background: '#1A365D', color: '#fff',
            border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer',
            fontWeight: 600, whiteSpace: 'nowrap',
          }}
        >
          ↻ Actualizar
        </button>

        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#718096', whiteSpace: 'nowrap' }}>
          {datosFiltrados.length} registro{datosFiltrados.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── Tabla ────────────────────────────────────────────────────── */}
      <div style={{ overflowX: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#A0AEC0' }}>
            <p>Cargando información...</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#EDF2F7', textAlign: 'left' }}>
                {['#', 'Tipo', 'Folio', 'Asunto', 'Usuario', 'Fecha', 'Estatus', 'Acciones'].map(h => (
                  <th key={h} style={{
                    padding: '10px 14px', fontWeight: 700, fontSize: 11,
                    letterSpacing: '0.06em', color: '#4A5568',
                    textTransform: 'uppercase', whiteSpace: 'nowrap',
                    borderBottom: '2px solid #E2E8F0',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {datosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: '#A0AEC0' }}>
                    No hay documentos con los filtros actuales.
                  </td>
                </tr>
              ) : (
                datosFiltrados.map((row, idx) => (
                  <tr key={row.key} style={{
                    borderBottom: '1px solid #EDF2F7',
                    background: idx % 2 === 0 ? '#fff' : '#FAFBFF',
                    transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = '#EBF4FF'}
                    onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? '#fff' : '#FAFBFF'}
                  >
                    <td style={{ padding: '10px 14px', color: '#A0AEC0', fontWeight: 600 }}>
                      {idx + 1}
                    </td>
                    <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                      <span style={{ fontSize: 13 }}>{row.tipoIcon} {row.tipoLabel}</span>
                    </td>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#2B6CB0', whiteSpace: 'nowrap' }}>
                      {row.folio || '-'}
                    </td>
                    <td style={{ padding: '10px 14px', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {row.asunto}
                    </td>
                    <td style={{ padding: '10px 14px', color: '#4A5568', whiteSpace: 'nowrap' }}>
                      {row.usuario}
                    </td>
                    <td style={{ padding: '10px 14px', color: '#718096', whiteSpace: 'nowrap' }}>
                      {row.fecha ? formatDateDisplay(row.fecha) : '-'}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <EstatusBadge label={row.estatus} />
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                      <button
                        onClick={() => onAbrirDetalle(row)}
                        style={{
                          padding: '5px 14px', background: '#fff', color: '#2B6CB0',
                          border: '1.5px solid #2B6CB0', borderRadius: 7,
                          fontSize: 12, fontWeight: 600, cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#2B6CB0'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#2B6CB0'; }}
                      >
                        Ver bitácora
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL — BandejaCentralPage con nuevo tab EN CURSO
// ─────────────────────────────────────────────────────────────────────────────

export const BandejaCentralPage = () => {
    // ── NUEVO: selector de vista principal (EN CURSO / CONTESTADO) ───────────
    const [vistaActiva, setVistaActiva] = useState('en_curso'); // 'en_curso' | 'contestado'

    // ── Estado del tab CONTESTADO (sin cambios) ───────────────────────────────
    const [activeTab, setActiveTab]     = useState('memorandums');
    const [datosTabla, setDatosTabla]   = useState([]);
    const [isLoading, setIsLoading]     = useState(false);
    const [modalOpen, setModalOpen]     = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [verConArchivo, setVerConArchivo] = useState(true);

    useEffect(() => {
        if (vistaActiva === 'contestado') cargarDatos(activeTab);
    }, [activeTab, vistaActiva]);

    const normalizeId = (val) => (val === null || val === undefined ? null : Number(val));

    const esContestacion = (o) =>
        o.idArea === null || o.idArea === undefined || o.idArea === 0 || o.esContestacion === true;

    // ── cargarDatos original intacto ─────────────────────────────────────────
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
                    const memoOriginal = memorandums.find(m => Number(m.id) === Number(item.idMemo));
                    const idCorrDelMemo = memoOriginal?.idCorrespondencia;
                    const oficioContestacion = idCorrDelMemo
                        ? oficios.find(o =>
                            Number(o.idCorrespondencia) === Number(idCorrDelMemo) &&
                            Number(o.id) !== Number(item.idMemo) &&
                            esContestacion(o))
                        : null;
                    const folioOriginal = memoOriginal?.folioUnico || memoOriginal?.folio_unico || memoOriginal?.folio || item.folioRespuesta;
                    return {
                        id: item.idSeguimientoMemorandum,
                        idMemo: item.idMemo,
                        idCorrespondencia: idCorrDelMemo || null,
                        folio: folioOriginal,
                        asunto: item.respuestaSeguimientoMemorandum,
                        fecha: pickFecha(item) || item.fechaResolucion,
                        estatus: item.idEstatus === 6 ? 'CONCLUIDO' : 'CONTESTADO',
                        archivo: oficioContestacion?.urlMemorandumGenerado || null,
                        nombreArchivo: oficioContestacion?.folioUnico || null,
                        tieneOficioContestacion: !!oficioContestacion,
                        tipo: 'memorandum'
                    };
                }));
            } else if (tab === 'oficios') {
                const data = await listarSeguimientosOficio();
                setDatosTabla(data.map(item => {
                    const oficioOriginal = oficios.find(o => Number(o.id) === Number(item.idOficio));
                    let oficioContest = null;
                    if (oficioOriginal?.idCorrespondencia) {
                        oficioContest = oficios.find(o =>
                            Number(o.idCorrespondencia) === Number(oficioOriginal.idCorrespondencia) &&
                            esContestacion(o));
                    }
                    const folioOriginal = oficioOriginal?.folioUnico || oficioOriginal?.folio_unico || oficioOriginal?.folio || item.folioRespuesta;
                    return {
                        id: item.idSeguimientoOficio,
                        idMemo: item.idOficio,
                        folio: folioOriginal,
                        asunto: item.respuestasSeguimientoOficio,
                        fecha: pickFecha(item) || item.fechaResolucion,
                        estatus: item.idEstatus === 6 ? 'CONCLUIDO' : 'CONTESTADO',
                        archivo: oficioContest?.urlMemorandumGenerado || null,
                        nombreArchivo: oficioContest?.folioUnico || null,
                        tieneOficioContestacion: !!oficioContest,
                        tipo: 'oficio'
                    };
                }));
            } else {
                const [data, correspondencias] = await Promise.all([
                    listarSeguimientosCorr(),
                    listarCorrespondencias()
                ]);
                setDatosTabla(data.map(item => {
                    const corrOriginal = correspondencias.find(c => Number(c.id) === Number(item.idCorrespondencia));
                    const oficioContest = corrOriginal
                        ? oficios.find(o =>
                            Number(o.idCorrespondencia) === Number(corrOriginal.id) &&
                            Number(o.id) !== Number(item.idMemo) &&
                            esContestacion(o))
                        : null;
                    const folioOriginal = corrOriginal?.folioUnico || corrOriginal?.folio_unico || corrOriginal?.folio || item.folioRespuesta;
                    return {
                        id: item.idSeguimientoCorrespondencia,
                        idMemo: item.idCorrespondencia,
                        folio: folioOriginal,
                        asunto: item.respuestaSeguimientoCorrespondencia,
                        fecha: pickFecha(item) || item.fechaResolucion,
                        estatus: item.idEstatus === 6 ? 'CONCLUIDO' : 'CONTESTADO',
                        archivo: oficioContest?.urlMemorandumGenerado || null,
                        nombreArchivo: oficioContest?.folioUnico || null,
                        tieneOficioContestacion: !!oficioContest,
                        tipo: 'correspondencia'
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
                await axios.put(`${API_BASE_URL}/seguimiento-memorandum/concluir/${item.id}`,
                    { respuestaSeguimientoMemorandum: comentario || 'Cierre desde bandeja' });
            } else if (item.tipo === 'correspondencia') {
                await axios.put(`${API_BASE_URL}/seguimiento-correspondencia/concluir/${item.id}`,
                    { respuestaSeguimientoCorrespondencia: comentario || 'Cierre desde bandeja' });
            } else {
                await axios.put(`${API_BASE_URL}/seguimiento-oficio/concluir/${item.id}`,
                    { respuestaSeguimientoOficio: comentario || 'Cierre desde bandeja' });
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

    // ── Estilos del selector de vista principal ───────────────────────────────
    const btnVistaStyle = (activa) => ({
        padding: '9px 28px', border: 'none', borderRadius: 0,
        fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s',
        borderBottom: activa ? '3px solid #2B6CB0' : '3px solid transparent',
        background: 'transparent',
        color: activa ? '#2B6CB0' : '#718096',
    });

    return (
        <div className="bandeja-wrapper">
            <div className="bandeja-header">
                <h1 className="bandeja-title">Bandeja de Contestación</h1>
                <p className="bandeja-subtitle">Gestiona y da seguimiento a los documentos asignados a tu área.</p>
            </div>

            {/* ── SELECTOR DE VISTA PRINCIPAL ─────────────────────────────────── */}
            <div style={{
                display: 'flex', borderBottom: '1px solid #E2E8F0',
                marginBottom: 0, background: '#fff',
                padding: '0 16px',
            }}>
                <button
                    style={btnVistaStyle(vistaActiva === 'en_curso')}
                    onClick={() => setVistaActiva('en_curso')}
                >
                    🔄 EN CURSO
                </button>
                <button
                    style={btnVistaStyle(vistaActiva === 'contestado')}
                    onClick={() => {
                        setVistaActiva('contestado');
                        cargarDatos(activeTab);
                    }}
                >
                    ✅ CONTESTADO
                </button>
            </div>

            <div className="bandeja-card" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>

                {/* ════════════════════════════════════════════════════════════ */}
                {/* VISTA: EN CURSO                                              */}
                {/* ════════════════════════════════════════════════════════════ */}
                {vistaActiva === 'en_curso' && (
                    <TabEnCurso onAbrirDetalle={handleAbrirDetalle} />
                )}

                {/* ════════════════════════════════════════════════════════════ */}
                {/* VISTA: CONTESTADO — sin ningún cambio respecto al original  */}
                {/* ════════════════════════════════════════════════════════════ */}
                {vistaActiva === 'contestado' && (
                    <>
                        <div className="bandeja-tabs-container">
                            <button className={`bandeja-tab ${activeTab === 'memorandums' ? 'active' : ''}`}
                                onClick={() => setActiveTab('memorandums')}>
                                📄 Memorándums
                            </button>
                            <button className={`bandeja-tab ${activeTab === 'correspondencia' ? 'active' : ''}`}
                                onClick={() => setActiveTab('correspondencia')}>
                                📨 Correspondencia
                            </button>
                            <button className={`bandeja-tab ${activeTab === 'oficios' ? 'active' : ''}`}
                                onClick={() => setActiveTab('oficios')}>
                                📋 Oficios
                            </button>
                        </div>

                        <div className="bandeja-filters-bar" style={{
                            padding: '1rem', display: 'flex',
                            justifyContent: 'flex-end', borderBottom: '1px solid #e2e8f0'
                        }}>
                            <div className="switch-container" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span className="switch-label" style={{ fontWeight: '600' }}>
                                    {verConArchivo ? '📋 Con oficio de contestación' : '📋 Sin oficio de contestación'}
                                </span>
                                <label className="switch">
                                    <input type="checkbox" checked={verConArchivo}
                                        onChange={(e) => setVerConArchivo(e.target.checked)} />
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
                                                            <button className="btn-atender"
                                                                onClick={() => handleAbrirDetalle(item)}>
                                                                Detalles
                                                            </button>
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
                    </>
                )}
            </div>

            {/* Modal compartido entre ambas vistas */}
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
