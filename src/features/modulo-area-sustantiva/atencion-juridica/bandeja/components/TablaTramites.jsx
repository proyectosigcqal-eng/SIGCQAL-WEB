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

const BadgeSinSemaforo = ({ estatus }) => {
  const t = (estatus ?? '').toLowerCase();
  if (t.includes('informe rendido') || t.includes('respuesta recibida')) {
    return <span className="bdg-badge badge-concluido">ATENDIDO</span>;
  }
  return <span className="bdg-badge badge-default">--</span>;
};

export const TablaTramites = ({ tramites, onInforme }) => {
  const navigate   = useNavigate();
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
              const bloqueado =
                t.estatus?.toUpperCase().includes('NO PRESENTADA') ||
                t.estatus?.toUpperCase().includes('BLOQUEADO')     ||
                t.estatus?.toUpperCase().includes('FINALIZADO');

              const estUp    = (t.estatus ?? '').toUpperCase();
              const etiqueta = bloqueado                 ? 'CERRADO'
                : estUp.includes('CIR')                 ? 'GENERAR CIR'
                : estUp.includes('OFICIO')              ? 'VER OFICIO'
                : estUp.includes('VALIDACIÓN') || estUp.includes('VALIDACION')
                                                        ? 'VALIDAR DOCS'
                :                                         'ATENDER';

              const puedeInforme = estUp.includes('OFICIO ENVIADO') && t.expedienteId;

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
                    {/* Semáforo de prevención (3 días hábiles) */}
                    {t.semaforoPlazos
                      ? <SemaforoPlazosAutoridad semaforo={t.semaforoPlazos} />
                      : <SemaforoContador folio={t.folio} />
                    }
                  </td>
                  <td className="bdg-action-cell">
                    <div style={{ display: 'inline-flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                      <button
                        className={`bdg-btn-action ${bloqueado ? 'bdg-btn-action--disabled' : ''}`}
                        disabled={bloqueado}
                        onClick={() => {
                          if (bloqueado) return;
                          navigate(`/atencion-juridica/checklist/${t.folio}`);
                        }}
                      >
                        {etiqueta}
                      </button>

                      {/* Botón INFORME — solo si el asesor de feature lo requiere */}
                      {onInforme && puedeInforme && (
                        <button
                          className="bdg-btn-action"
                          style={{ background: '#166534' }}
                          onClick={() => onInforme(t.expedienteId)}
                          type="button"
                        >
                          INFORME
                        </button>
                      )}
                    </div>
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