import { Scale, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';



const BadgeEstatus = ({ label }) => {
  const getClass = (text) => {
    const t = text?.toUpperCase();
    if (t?.includes('CALIFICACION') || t?.includes('CALIFICACIÓN')) return 'badge-calificacion';
    if (t?.includes('REGISTRO')) return 'badge-registro';
    if (t?.includes('PROCESO')) return 'badge-proceso';
    if (t?.includes('ASIGNADO')) return 'badge-asignado';
    if (t?.includes('CONCLUIDO')) return 'badge-concluido';
    return 'badge-default';
  };

  return <span className={`bdg-badge ${getClass(label)}`}>{label}</span>;
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
          <th>FOLIO</th>
          <th>CONTRIBUYENTE</th>
          <th>ESTATUS</th>
          <th>ÚLTIMA MODIFICACIÓN</th>
          <th>FICHA</th>
        </tr>
      </thead>
      <tbody>
        {tramites.map((t) => (
          <tr key={t.id}>
            <td>
              <div className="bdg-folio">{t.folio}</div>
              <div className="bdg-sub">{t.municipio}</div>
            </td>
            <td>
              <div className="bdg-contribuyente">{t.contribuyente}</div>
              <div className="bdg-sub bdg-impuesto">{t.impuesto}</div>
            </td>
            <td>
              <div className="bdg-estatus-col">
                <BadgeEstatus label={t.estatusPrincipal} />
                <BadgeEstatus label={t.estatusSecundario} />
              </div>
            </td>
            <td>
              <div className="bdg-modificacion">{t.ultimaModificacion}</div>
              <div className="bdg-sub">{t.fecha}</div>
            </td>
            <td className="bdg-action-cell">
              <button
                className="bdg-icon-btn"
                title="Ver Ficha del Expediente"
                onClick={() => navigate(`/atencion-juridica/tramites-irl/${t.folio}`)}
              >
                <ExternalLink size={18} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
