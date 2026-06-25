import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SemaforoContador } from '@/features/modulo-area-sustantiva/atencion-juridica/prevencion/components/SemaforoPlazo';
import { SemaforoPlazosAutoridad } from '@/features/modulo-area-sustantiva/atencion-juridica/plazo-autoridad/components/SemaforoPlazosAutoridad';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_dev';

const TIPO_TRAMITE_TABS = [
  { id: 'ASESORIA_SIMPLIFICADA',    label: 'Asesoría Simplificada' },
  { id: 'QUEJAS_RECLAMACIONES',     label: 'Quejas y Reclamaciones' },
  { id: 'REPRESENTACION_LEGAL_IRL', label: 'Representación Legal IRL' },
];

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
      {
        tipo: 'descarga',
        label: 'DESCARGAR CIR',
        // ✅ ya estaba correcta — coincide con ConstanciaInternaRemisionController
        url: `${API_BASE}/api/v1/expedientes/folio/${t.folio}/constancia-interna-remision/descargar`,
      },
      t.tieneAri
        ? { tipo: 'navegacion', label: 'VER ARI',     ruta: `/area-sustantiva/quejas-ari/${t.folio}` }
        : { tipo: 'navegacion', label: 'GENERAR ARI', ruta: `/area-sustantiva/quejas-ari/${t.folio}` },
    ];
  }

  if (estUp.includes('ARI')) {
    return [
      {
        tipo: 'descarga',
        label: 'DESCARGAR ARI',
        // ✅ corregido — coincide con el nuevo endpoint en QuejasAriController
        url: `${API_BASE}/api/v1/quejas-ari/folio/${t.folio}/descargar`,
      },
      t.tieneOficio
        ? { tipo: 'navegacion', label: 'VER OFICIO',     ruta: `/atencion-juridica/oficio-notificacion/${t.folio}` }
        : { tipo: 'navegacion', label: 'GENERAR OFICIO', ruta: `/atencion-juridica/oficio-notificacion/${t.folio}` },
    ];
  }

  if (estUp.includes('OFICIO')) {
    return [
      {
        tipo: 'descarga',
        label: 'DESCARGAR Oficio',
        // ✅ corregido — coincide con el nuevo endpoint en OficioNotificacionController
        url: `${API_BASE}/api/v1/oficio-notificacion/folio/${t.folio}/descargar`,
      },
      t.tieneContestacion
        ? { tipo: 'navegacion', label: 'VER CONTESTACIÓN',       ruta: `/atencion-juridica/contestacion-autoridad/${t.folio}` }
        : { tipo: 'navegacion', label: 'REGISTRAR CONTESTACIÓN', ruta: `/atencion-juridica/contestacion-autoridad/${t.folio}` },
    ];
  }

  if (estUp.includes('CONTESTACIÓN') || estUp.includes('CONTESTACION')) {
    return [
      { tipo: 'navegacion', label: 'ATENDER', ruta: `/atencion-juridica/contestacion-autoridad/${t.folio}` }
    ];
  }

  if (estUp.includes('ACCI')) {
    return [
      {
        tipo: 'descarga',
        label: 'DESCARGAR ACCI',
        // ✅ corregido — coincide con el nuevo endpoint en QuejasAcciController
        url: `${API_BASE}/api/v1/quejas-acci/folio/${t.folio}/descargar`,
      },
      t.tieneResolucion
        ? { tipo: 'navegacion', label: 'VER RESOLUCIÓN',     ruta: `/atencion-juridica/resolucion-final/${t.folio}` }
        : { tipo: 'navegacion', label: 'GENERAR RESOLUCIÓN', ruta: `/atencion-juridica/resolucion-final/${t.folio}` },
    ];
  }

 if (estUp.includes('RESOLUCIÓN') || estUp.includes('RESOLUCION')) {
  return [
    {
      tipo: 'descarga',
      label: 'DESCARGAR Resolución',
      url: `${API_BASE}/api/modulo-area-sustantiva/resolucion-final/folio/${t.folio}/descargar`,
    },
    { tipo: 'navegacion', label: 'NOTIFICAR', ruta: `/area-sustantiva/cierre-test/${t.folio}` }];
}

  if (estUp.includes('NOTIFICACIÓN FINAL') || estUp.includes('NOTIFICACION FINAL')) {
    return [{ tipo: 'navegacion', label: 'CERRAR EXPEDIENTE', ruta: `/area-sustantiva/cierre-test/${t.folio}` }];
  }

  return [{ tipo: 'navegacion', label: 'ATENDER', ruta: `/atencion-juridica/checklist/${t.folio}` }];
};
export const TablaTramites = ({ tramites }) => {
  const navigate = useNavigate();
  const [tipoActivo, setTipoActivo] = useState('QUEJAS_RECLAMACIONES');

  const tramitesFiltrados = tipoActivo === 'QUEJAS_RECLAMACIONES'
    ? (tramites ?? [])
    : [];

  return (
    <div className="bdg-tabla-wrapper">
      {/* ── Tabs / Switch de Etapas moderno utilizando clases CSS ── */}
      <div className="bdg-switch-bar">
        {TIPO_TRAMITE_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTipoActivo(tab.id)}
            className={`bdg-switch-btn ${tipoActivo === tab.id ? 'is-active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tramitesFiltrados.length === 0 ? (
        <div className="bdg-empty">
          <div className="bdg-empty-icon">📂</div>
          <p>
            {tipoActivo === 'QUEJAS_RECLAMACIONES'
              ? 'No se encontraron trámites con los filtros seleccionados.'
              : 'Este módulo estará disponible próximamente.'}
          </p>
        </div>
      ) : (
        /* Contenedor responsivo para evitar desbordamientos */
        <div className="bdg-table-responsive">
          <table className="bdg-table">
            <thead>
              <tr>
                <th>FOLIO ASESORÍA</th>
                <th>EXPEDIENTE QUEJA</th>
                <th>QUEJOSO</th>
                <th>ASUNTO</th>
                <th>ESTATUS</th>
                <th>SEMÁFORO / CONTADOR</th>
                <th style={{ textAlignment: 'right' }}>ACCIONES</th>
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
                    <td>
                      <BadgeEstatus label={t.estatus} bloqueado={bloqueado} />
                    </td>
                    <td>
                      {(estUp.includes('ASIGNADA A ASESOR') ||
                        estUp.includes('VALIDACIÓN') ||
                        estUp.includes('VALIDACION'))
                        ? <SemaforoContador folio={t.folio} />
                        : <span className="bdg-divider-null">—</span>
                      }
                    </td>
                    <td className="bdg-action-cell">
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
    </div>
  );
};