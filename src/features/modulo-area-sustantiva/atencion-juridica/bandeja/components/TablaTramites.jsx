import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SemaforoContador } from '@/features/modulo-area-sustantiva/atencion-juridica/prevencion/components/SemaforoPlazo';
import { SemaforoPlazosAutoridad } from '@/features/modulo-area-sustantiva/atencion-juridica/plazo-autoridad/components/SemaforoPlazosAutoridad';

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

const calcularAccion = (t, estUp) => {
  if (estUp.includes('ASIGNADA A ASESOR')) {
    if (t.tieneCir) {
      return { label: 'VER CIR', ruta: `/atencion-juridica/cir/${t.folio}` };
    }
    if (t.checklistCompleto) {
      return { label: 'GENERAR CIR', ruta: `/atencion-juridica/cir/${t.folio}` };
    }
    return { label: 'ATENDER', ruta: `/atencion-juridica/checklist/${t.folio}` };
}
  if (estUp.includes('VALIDACIÓN') || estUp.includes('VALIDACION')) {
    return { label: 'VALIDAR DOCS', ruta: `/atencion-juridica/checklist/${t.folio}` };
  }
  if (estUp.includes('CIR GENERADA')) {
    return t.tieneAri
      ? { label: 'VER ARI', ruta: `/atencion-juridica/ari/${t.folio}` }
      : { label: 'GENERAR ARI', ruta: `/atencion-juridica/ari/${t.folio}` };
  }
  if (estUp.includes('ARI GENERADO')) {
    return t.tieneOficio
      ? { label: 'VER OFICIO', ruta: `/atencion-juridica/oficio-notificacion/${t.folio}` }
      : { label: 'GENERAR OFICIO', ruta: `/atencion-juridica/oficio-notificacion/${t.folio}` };
  }
  if (estUp.includes('OFICIO DE NOTIFICACIÓN') || estUp.includes('OFICIO DE NOTIFICACION')) {
    return t.tieneContestacion
      ? { label: 'VER CONTESTACIÓN', ruta: `/atencion-juridica/contestacion-autoridad/${t.folio}` }
      : { label: 'REGISTRAR CONTESTACIÓN', ruta: `/atencion-juridica/contestacion-autoridad/${t.folio}` };
  }
  if (estUp.includes('CONTESTACIÓN DE AUTORIDAD') || estUp.includes('CONTESTACION DE AUTORIDAD')) {
    return t.tieneAcci
      ? { label: 'VER ACCI', ruta: `/atencion-juridica/acci/${t.folio}` }
      : { label: 'ATENDER', ruta: `/atencion-juridica/contestacion-autoridad/${t.folio}` };
  }
  if (estUp.includes('ACCI GENERADO')) {
    return t.tieneResolucion
      ? { label: 'VER RESOLUCIÓN', ruta: `/atencion-juridica/resolucion/${t.folio}` }
      : { label: 'GENERAR RESOLUCIÓN', ruta: `/atencion-juridica/resolucion/${t.folio}` };
  }
  if (estUp.includes('RESOLUCIÓN') || estUp.includes('RESOLUCION')) {
    return { label: 'NOTIFICAR', ruta: `/atencion-juridica/notificacion-final/${t.folio}` };
  }
  if (estUp.includes('NOTIFICACIÓN FINAL') || estUp.includes('NOTIFICACION FINAL')) {
    return { label: 'CERRAR EXPEDIENTE', ruta: `/atencion-juridica/cierre/${t.folio}` };
  }
  return { label: 'ATENDER', ruta: `/atencion-juridica/checklist/${t.folio}` };
};

export const TablaTramites = ({ tramites }) => {
  const navigate = useNavigate();
  const [tipoActivo, setTipoActivo] = useState('QUEJAS_RECLAMACIONES');

  const tramitesFiltrados = tipoActivo === 'QUEJAS_RECLAMACIONES'
    ? (tramites ?? [])
    : [];

  return (
    <div>
      {/* ── Switch triple ── */}
      <div style={{
        display: 'flex', gap: 0, marginBottom: '1.25rem',
        borderRadius: 8, border: '0.5px solid var(--color-border-secondary)',
        overflow: 'hidden', width: 'fit-content',
      }}>
        {TIPO_TRAMITE_TABS.map((tab, i) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTipoActivo(tab.id)}
            style={{
              padding: '8px 20px', fontSize: 13, fontWeight: 600,
              border: 'none', whiteSpace: 'nowrap', cursor: 'pointer',
              borderRight: i < TIPO_TRAMITE_TABS.length - 1
                ? '0.5px solid var(--color-border-secondary)' : 'none',
              background: tipoActivo === tab.id ? '#1e3a8a' : 'var(--color-background-primary)',
              color:      tipoActivo === tab.id ? '#fff'    : 'var(--color-text-secondary)',
              transition: 'background 0.12s, color 0.12s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tramitesFiltrados.length === 0 ? (
        <div className="bdg-empty">
          <p>
            {tipoActivo === 'QUEJAS_RECLAMACIONES'
              ? 'No se encontraron trámites con los filtros seleccionados.'
              : 'Este módulo estará disponible próximamente.'}
          </p>
        </div>
      ) : (
        <table className="bdg-table">
          <thead>
            <tr>
              <th>FOLIO ASESORÍA</th>
              <th>EXPEDIENTE QUEJA</th>
              <th>QUEJOSO</th>
              <th>ASUNTO</th>
              <th>ESTATUS</th>
              <th>SEMÁFORO/CONTADOR</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {tramitesFiltrados.map((t) => {
              const bloqueado = t.bloqueado === true;
              const estUp     = (t.estatus ?? '').toUpperCase();
              const accion    = calcularAccion(t, estUp);

              return (
                <tr key={t.id} className={bloqueado ? 'bdg-row--bloqueado' : ''}>
                  <td>
                    <div className="bdg-folio">{t.folio}</div>
                    <div className="bdg-sub">{t.municipio}</div>
                  </td>
                  <td>
                    <div className="bdg-folio">{t.folio}</div>
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
                    {t.semaforoPlazos
                      ? <SemaforoPlazosAutoridad semaforo={t.semaforoPlazos} />
                      : <SemaforoContador folio={t.folio} />
                    }
                  </td>
                  <td className="bdg-action-cell">
                    <button
                      className={`bdg-btn-action ${bloqueado ? 'bdg-btn-action--disabled' : ''}`}
                      disabled={bloqueado}
                      onClick={() => !bloqueado && navigate(accion.ruta)}
                    >
                      {bloqueado ? 'CERRADO' : accion.label}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};