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

  // ── ASIGNADA A ASESOR ─────────────────────────────────────────────
  if (estUp.includes('ASIGNADA A ASESOR')) {
    if (t.tieneCir) {
      return { label: 'VER CIR', ruta: `/atencion-juridica/checklist/${t.folio}` }; // temporal hasta que CIR tenga ruta
    }
    if (t.checklistCompleto) {
      return { label: 'GENERAR CIR', ruta: `/atencion-juridica/checklist/${t.folio}` }; // temporal
    }
    return { label: 'ATENDER', ruta: `/atencion-juridica/checklist/${t.folio}` };
  }

  // ── VALIDACIÓN DE REQUISITOS ──────────────────────────────────────
  if (estUp.includes('VALIDACIÓN') || estUp.includes('VALIDACION')) {
    return { label: 'VALIDAR DOCS', ruta: `/atencion-juridica/checklist/${t.folio}` };
  }

  // ── CIR GENERADA ─────────────────────────────────────────────────
  if (estUp.includes('CIR')) {
    return t.tieneAri
      ? { label: 'VER ARI',     ruta: `/area-sustantiva/quejas-ari` }
      : { label: 'GENERAR ARI', ruta: `/area-sustantiva/quejas-ari` };
  }

  // ── ARI GENERADO ─────────────────────────────────────────────────
  if (estUp.includes('ARI')) {
    return t.tieneOficio
      ? { label: 'VER OFICIO',     ruta: `/atencion-juridica/oficio-notificacion/${t.folio}` }
      : { label: 'GENERAR OFICIO', ruta: `/atencion-juridica/oficio-notificacion/${t.folio}` };
  }

  // ── OFICIO DE NOTIFICACIÓN ────────────────────────────────────────
  if (estUp.includes('OFICIO')) {
    return t.tieneContestacion
      ? { label: 'VER CONTESTACIÓN',       ruta: `/atencion-juridica/contestacion-autoridad/${t.folio}` }
      : { label: 'REGISTRAR CONTESTACIÓN', ruta: `/atencion-juridica/contestacion-autoridad/${t.folio}` };
  }

  // ── CONTESTACIÓN DE AUTORIDAD ─────────────────────────────────────
  // Desde aquí el asesor decide: ACCI o Resolución
  if (estUp.includes('CONTESTACIÓN') || estUp.includes('CONTESTACION')) {
    // Siempre va a contestación-autoridad porque ahí está la decisión ACCI vs Resolución
    return { label: 'ATENDER', ruta: `/atencion-juridica/contestacion-autoridad/${t.folio}` };
  }

  // ── ACCI GENERADO ─────────────────────────────────────────────────
  if (estUp.includes('ACCI')) {
    return t.tieneResolucion
      ? { label: 'VER RESOLUCIÓN',     ruta: `/atencion-juridica/contestacion-autoridad/${t.folio}` }
      : { label: 'GENERAR RESOLUCIÓN', ruta: `/atencion-juridica/contestacion-autoridad/${t.folio}` };
  }

  // ── INFORME DE RESOLUCIÓN ─────────────────────────────────────────
  if (estUp.includes('RESOLUCIÓN') || estUp.includes('RESOLUCION')) {
    return { label: 'NOTIFICAR', ruta: `/area-sustantiva/cierre-test/${t.folio}` };
  }

  // ── EN PROCESO DE NOTIFICACIÓN FINAL ─────────────────────────────
  if (estUp.includes('NOTIFICACIÓN FINAL') || estUp.includes('NOTIFICACION FINAL')) {
    return { label: 'CERRAR EXPEDIENTE', ruta: `/area-sustantiva/cierre-test/${t.folio}` };
  }

  // ── Default ───────────────────────────────────────────────────────
  return { label: 'ATENDER', ruta: `/atencion-juridica/checklist/${t.folio}` };
};
<<<<<<< Updated upstream
export const TablaTramites = ({ tramites }) => {
=======

export const TablaTramites = ({ tramites, onVerBitacora}) => {
>>>>>>> Stashed changes
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

              console.log("Estructura de t:", t);

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
                      {/* Solo mostrar semáforo en las etapas iniciales */}
                      {(estUp.includes('ASIGNADA A ASESOR') || 
                        estUp.includes('VALIDACIÓN') || 
                        estUp.includes('VALIDACION'))
                        ? (t.semaforoPlazos
                            ? <SemaforoPlazosAutoridad semaforo={t.semaforoPlazos} />
                            : <SemaforoContador folio={t.folio} />
                          )
                        : <span style={{ color: '#999', fontSize: '0.8rem' }}>—</span>
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
                    {/* Botón de Bitácora independiente */}
                    <button
                      className="bdg-btn-bitacora" 
                      onClick={(e) => {
                        e.stopPropagation();
                        // AQUÍ ES DONDE CAMBIAREMOS t.id_queja POR EL CAMPO CORRECTO
                        console.log("ID detectado:", t.id); // prueba con t.id o t.idQueja
                        onVerBitacora(t.id); // <--- CAMBIA 't.id_queja' por lo que diga el log
                      }}
                    >
                      Bitácora
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