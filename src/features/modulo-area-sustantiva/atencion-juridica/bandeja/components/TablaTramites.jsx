import { ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

export const TablaTramites = ({ tramites, onBitacora, onFicha }) => {
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
          return (
            <tr key={t.id}>
              <td><div className="bdg-folio">{t.folio}</div></td>
              <td><div className="bdg-folio">{t.folio}</div></td>
              <td><div className="bdg-contribuyente">{t.contribuyente}</div></td>
              <td><div className="bdg-asunto">{t.asunto}</div></td>
              <td><BadgeEstatus label={t.estatus} /></td>
              <td><BadgeContador value={t.seguimiento} /></td>
              <td className="bdg-action-cell">
                <button
                  className="bdg-btn-action"
                  onClick={() => navigate(`/atencion-juridica/tramites-irl/${t.folio}`)}
                >
                  {etiquetaAccion} <ExternalLink size={16} />
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
