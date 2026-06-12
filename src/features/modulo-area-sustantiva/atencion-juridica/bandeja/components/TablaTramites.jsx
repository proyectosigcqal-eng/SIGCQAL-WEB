import { ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SemaforoPlazosAutoridad } from '@/features/modulo-area-sustantiva/atencion-juridica/plazo-autoridad/components/SemaforoPlazosAutoridad';

const normalizar = (value) =>
  (value ?? '')
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');

const BadgeEstatus = ({ label }) => (
  <span className="bdg-badge bdg-badge--estatus">{label}</span>
);

const BadgeContador = ({ value }) => {
  const t = normalizar(value);
  const match = /^(\d+)/.exec(t);
  const dias = match?.[1] ? Number(match[1]) : null;
  const cls = dias !== null && dias <= 1 ? 'bdg-badge--rojo' : 'bdg-badge--verde';
  return <span className={`bdg-badge ${cls}`}>{value || '--'}</span>;
};

const BadgeSinSemaforo = ({ estatus }) => {
  const estatusNorm = normalizar(estatus);

  if (estatusNorm.includes('informe rendido') || estatusNorm.includes('respuesta recibida')) {
    return <span className="bdg-badge badge-concluido">ATENDIDO</span>;
  }

  return <span className="bdg-badge badge-default">--</span>;
};

export const TablaTramites = ({ tramites, onInforme, onBitacora, onFicha }) => {
  if (!tramites || tramites.length === 0) {
    return (
      <div className="bdg-empty">
        <p>No se encontraron trámites con los filtros seleccionados.</p>
      </div>
    );
  }

  const navigate = useNavigate();

  return (
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
        {tramites.map((t) => {
          const estatusNorm = normalizar(t.estatus);
          const etiquetaAccion = estatusNorm.includes('cir') ? 'GENERAR CIR' : 'VER';
          const puedeRegistrarInforme = estatusNorm.includes('oficio enviado') && t.expedienteId;
          return (
            <tr key={t.id}>
              <td><div className="bdg-folio">{t.folio}</div></td>
              <td><div className="bdg-folio">{t.folio}</div></td>
              <td><div className="bdg-contribuyente">{t.contribuyente}</div></td>
              <td><div className="bdg-asunto">{t.asunto}</div></td>
              <td><BadgeEstatus label={t.estatus} /></td>
              <td>
                {t.semaforoPlazos
                  ? <SemaforoPlazosAutoridad semaforo={t.semaforoPlazos} />
                  : <BadgeSinSemaforo estatus={t.estatus} />}
              </td>
              <td className="bdg-action-cell">
                <div style={{ display: 'inline-flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button
                    className="bdg-btn-action"
                    onClick={() => navigate(`/atencion-juridica/tramites-irl/${t.folio}`)}
                    type="button"
                  >
                    {etiquetaAccion} <ExternalLink size={16} />
                  </button>
                  {onInforme && (
                    <button
                      className="bdg-btn-action"
                      onClick={() => onInforme(t.expedienteId)}
                      disabled={!puedeRegistrarInforme}
                      type="button"
                      style={{ background: puedeRegistrarInforme ? '#166534' : '#9ca3af' }}
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
  );
};
