// features/modulo-area-sustantiva/atencion-juridica/bandeja/components/TablaTramites.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SemaforoContador } from '@/features/modulo-area-sustantiva/atencion-juridica/prevencion/components/SemaforoPlazo';
import { SemaforoPlazosAutoridad } from '@/features/modulo-area-sustantiva/atencion-juridica/plazo-autoridad/components/SemaforoPlazosAutoridad';
import BitacoraHistoricaSustantivaModal from '../../../../../pages/modulo-area-sustantiva/bitacora-historica-sustantiva/BitacoraHistoricaSustantivaModal';
import { FileText } from 'lucide-react';
import { useBandejaIrl } from "@/features/modulo-area-sustantiva/representacion-legal-irl/hooks/useBandejaIrl";
import { TablaIrl } from "@/features/modulo-area-sustantiva/representacion-legal-irl/components/TablaIrl";

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_dev';

export const TIPO_TRAMITE_TABS = [
  { id: 'ASESORIA_SIMPLIFICADA',    label: 'Asesoría Simplificada' },
  { id: 'QUEJAS_RECLAMACIONES',     label: 'Quejas y Reclamaciones' },
  { id: 'REPRESENTACION_LEGAL_IRL', label: 'Representación Legal IRL' },
];

const formatFecha = (valor) => {
  if (!valor) return null;
  const fecha = new Date(valor);
  if (isNaN(fecha.getTime())) return null;
  return fecha.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const obtenerFechaRegistro = (t, estUp) => {
  if (estUp.includes('CIR'))                                            return t.fechaCir;
  if (estUp.includes('ARI'))                                            return t.fechaAri;
  if (estUp.includes('OFICIO'))                                         return t.fechaOficio;
  if (estUp.includes('CONTESTACIÓN') || estUp.includes('CONTESTACION')) return t.fechaContestacion;
  if (estUp.includes('ACCI'))                                           return t.fechaAcci;
  if (estUp.includes('RESOLUCIÓN') || estUp.includes('RESOLUCION'))     return t.fechaResolucion;
  return null;
};

const obtenerEtiquetaFecha = (estUp) => {
  if (estUp.includes('CIR'))                                            return 'CIR generada';
  if (estUp.includes('ARI'))                                            return 'ARI generado';
  if (estUp.includes('OFICIO'))                                         return 'Oficio emitido';
  if (estUp.includes('CONTESTACIÓN') || estUp.includes('CONTESTACION')) return 'Contestación recibida';
  if (estUp.includes('ACCI'))                                           return 'ACCI generado';
  if (estUp.includes('RESOLUCIÓN') || estUp.includes('RESOLUCION'))     return 'Resolución emitida';
  return null;
};

const BadgeEstatus = ({ label, bloqueado }) => (
  <span className={`bdg-badge ${bloqueado ? 'bdg-badge--bloqueado' : 'bdg-badge--estatus'}`}>
    {label || '—'}
  </span>
);

const calcularAcciones = (t, estUp) => {
  if (estUp.includes('ASIGNADA A ASESOR')) {
    if (t.checklistCompleto) {
      return [{ tipo: 'navegacion', label: 'GENERAR CIR', ruta: `/atencion-juridica/constancia-interna-remision/${t.folio}` }];
    }
    return [{ tipo: 'navegacion', label: 'ATENDER', ruta: `/atencion-juridica/checklist/${t.folio}` }];
  }

  if (estUp.includes('VALIDACIÓN') || estUp.includes('VALIDACION')) {
    return [{ tipo: 'navegacion', label: 'VALIDAR DOCS', ruta: `/atencion-juridica/checklist/${t.folio}` }];
  }

  if (estUp.includes('CIR')) {
    return [
      { tipo: 'descarga', label: 'DESCARGAR CIR', url: `${API_BASE}/api/v1/expedientes/folio/${t.folio}/constancia-interna-remision/descargar` },
      t.tieneAri
        ? { tipo: 'navegacion', label: 'VER ARI',     ruta: `/area-sustantiva/quejas-ari/${t.folio}` }
        : { tipo: 'navegacion', label: 'GENERAR ARI', ruta: `/area-sustantiva/quejas-ari/${t.folio}` },
    ];
  }

  if (estUp.includes('ARI')) {
    return [
      { tipo: 'descarga', label: 'DESCARGAR ARI', url: `${API_BASE}/api/v1/quejas-ari/folio/${t.folio}/descargar` },
      t.tieneOficio
        ? { tipo: 'navegacion', label: 'VER OFICIO',     ruta: `/atencion-juridica/oficio-notificacion/${t.folio}` }
        : { tipo: 'navegacion', label: 'GENERAR OFICIO', ruta: `/atencion-juridica/oficio-notificacion/${t.folio}` },
    ];
  }

  if (estUp.includes('OFICIO')) {
    return [
      { tipo: 'descarga', label: 'DESCARGAR Oficio', url: `${API_BASE}/api/v1/oficio-notificacion/folio/${t.folio}/descargar` },
      t.tieneContestacion
        ? { tipo: 'navegacion', label: 'VER CONTESTACIÓN',       ruta: `/atencion-juridica/contestacion-autoridad/${t.folio}` }
        : { tipo: 'navegacion', label: 'REGISTRAR CONTESTACIÓN', ruta: `/atencion-juridica/contestacion-autoridad/${t.folio}` },
    ];
  }

  if (estUp.includes('CONTESTACIÓN') || estUp.includes('CONTESTACION')) {
    return [{ tipo: 'navegacion', label: 'ATENDER', ruta: `/atencion-juridica/contestacion-autoridad/${t.folio}` }];
  }

  if (estUp.includes('ACCI')) {
    return [
      { tipo: 'descarga', label: 'DESCARGAR ACCI', url: `${API_BASE}/api/v1/quejas-acci/folio/${t.folio}/descargar` },
      t.tieneResolucion
        ? { tipo: 'navegacion', label: 'VER RESOLUCIÓN',     ruta: `/atencion-juridica/resolucion-final/${t.folio}` }
        : { tipo: 'navegacion', label: 'GENERAR RESOLUCIÓN', ruta: `/atencion-juridica/resolucion-final/${t.folio}` },
    ];
  }

  if (estUp.includes('RESOLUCIÓN') || estUp.includes('RESOLUCION')) {
    return [
      { tipo: 'descarga',   label: 'DESCARGAR Resolución', url: `${API_BASE}/api/modulo-area-sustantiva/resolucion-final/folio/${t.folio}/descargar` },
      { tipo: 'navegacion', label: 'NOTIFICAR',             ruta: `/area-sustantiva/cierre-test/${t.folio}` },
    ];
  }

  if (estUp.includes('NOTIFICACIÓN FINAL') || estUp.includes('NOTIFICACION FINAL')) {
    return [{ tipo: 'navegacion', label: 'CERRAR EXPEDIENTE', ruta: `/area-sustantiva/cierre-test/${t.folio}` }];
  }

  return [{ tipo: 'navegacion', label: 'ATENDER', ruta: `/atencion-juridica/checklist/${t.folio}` }];
};

export const TablaTramites = ({ tramites, tipoActivo }) => {
  const navigate = useNavigate();

  // El estado de tipoActivo se movió al Padre para poder renderizar el switch arriba
  const [idQuejaSeleccionada, setIdQuejaSeleccionada] = useState(null);


  const isIrlActivo = tipoActivo === 'REPRESENTACION_LEGAL_IRL';
  const {
    busqueda: irlBusqueda,
    setBusqueda: setIrlBusqueda,
    subSwitchActivo,
    setSubSwitchActivo,
    items: irlItems,
    cargando: irlCargando,
    error: irlError,
    SUB_SWITCHES,
  } = useBandejaIrl({ enabled: isIrlActivo });

  const tramitesFiltrados = tipoActivo === 'QUEJAS_RECLAMACIONES' ? (tramites ?? []) : [];
const primerEstatusUp = (tramitesFiltrados[0]?.estatus ?? '').toUpperCase();
const usaSemaforo = primerEstatusUp.includes('ASIGNADA A ASESOR') ||
                     primerEstatusUp.includes('VALIDACIÓN') ||
                     primerEstatusUp.includes('VALIDACION');
const headerSemaforo = usaSemaforo ? 'SEMÁFORO / CONTADOR' : 'FECHA DE REGISTRO';
  return (
    <div className="bdg-tabla-wrapper">

     

      {/* ── Tab IRL ── */}
      {isIrlActivo ? (
        <TablaIrl
          subSwitchActivo={subSwitchActivo}
          setSubSwitchActivo={setSubSwitchActivo}
          busqueda={irlBusqueda}
          setBusqueda={setIrlBusqueda}
          items={irlItems}
          cargando={irlCargando}
          error={irlError}
          SUB_SWITCHES={SUB_SWITCHES}
        />
      ) : tramitesFiltrados.length === 0 ? (
        <div className="bdg-empty">
          <div className="bdg-empty-icon">📂</div>
          <p>
            {tipoActivo === 'QUEJAS_RECLAMACIONES'
              ? 'No se encontraron trámites con los filtros seleccionados.'
              : 'Este módulo estará disponible próximamente.'}
          </p>
        </div>
      ) : (
        <div className="bdg-table-responsive">
          <table className="bdg-table">
            <thead>
              <tr>
                <th>FOLIO ASESORÍA</th>
                <th>EXPEDIENTE QUEJA</th>
                <th>QUEJOSO</th>
                <th>ASUNTO</th>
                <th>FECHA</th>
                <th>ESTATUS</th>
                <th>{headerSemaforo}</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {tramitesFiltrados.map((t) => {
                const bloqueado = t.bloqueado === true;
                const estUp     = (t.estatus ?? '').toUpperCase();
                const acciones  = calcularAcciones(t, estUp);

                return (
                  <tr key={t.id} className={bloqueado ? 'bdg-row--bloqueado' : ''}>
                    <td>
                      <div className="bdg-folio">{t.folio}</div>
                      <div className="bdg-sub">{t.municipio}</div>
                    </td>
                    <td>
                      <div className="bdg-folio-secundario">{t.idExpediente}</div>
                    </td>
                    <td>
                      <div className="bdg-contribuyente">{t.contribuyente}</div>
                    </td>
                    <td>
                      <div className="bdg-asunto">{t.asunto}</div>
                    </td>
                    <td className="bdg-celda-fecha">
                      <span>{t.fecha ? new Date(t.fecha).toLocaleDateString('es-MX') : '—'}</span>
                    </td>
                    <td>
                      <BadgeEstatus label={t.estatus} bloqueado={bloqueado} />
                    </td>
                 <td>
  {(estUp.includes('ASIGNADA A ASESOR') ||
    estUp.includes('VALIDACIÓN') ||
    estUp.includes('VALIDACION'))
    ? <SemaforoContador folio={t.folio} />
    : (() => {
        const fecha    = formatFecha(obtenerFechaRegistro(t, estUp));
        const etiqueta = obtenerEtiquetaFecha(estUp);
        return fecha
          ? (
            <div className="bdg-fecha-registro">
              <div className="bdg-fecha-label">{etiqueta}</div>
              <div className="bdg-fecha-valor">{fecha}</div>
            </div>
          )
          : <span className="bdg-divider-null">—</span>;
      })()
  }
</td>
                    <td className="bdg-action-cell">

                      {/* Botón Bitácora — siempre visible */}
                      <button
                        className="bdg-btn-action bdg-btn-action--icon"
                        onClick={() => setIdQuejaSeleccionada(t.id)}
                        title="Ver Bitácora"
                      >
                        <FileText size={16} />
                        <span>BITÁCORA</span>
                      </button>

                      {bloqueado ? (
                        <button className="bdg-btn-action bdg-btn-action--disabled" disabled>
                          CERRADO
                        </button>
                      ) : (
                        acciones.map((accion, i) =>
                          accion.tipo === 'descarga' ? (
                            <a
                              key={i}
                              className="bdg-btn-action bdg-btn-action--secundario"
                              href={accion.url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <span className="bdg-btn-icon">📥</span>
                              {accion.label}
                            </a>
                          ) : (
                            <button
                              key={i}
                              className="bdg-btn-action"
                              onClick={() => navigate(accion.ruta)}
                            >
                              {accion.label}
                            </button>
                          )
                        )
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de bitácora — fuera de la tabla */}
      {idQuejaSeleccionada && (
        <BitacoraHistoricaSustantivaModal
          idQueja={idQuejaSeleccionada}
          onClose={() => setIdQuejaSeleccionada(null)}
        />
      )}

    </div>
  );
};
