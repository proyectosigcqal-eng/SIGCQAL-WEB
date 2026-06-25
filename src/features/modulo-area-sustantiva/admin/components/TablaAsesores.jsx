import { Pencil, UserX } from 'lucide-react';

export const TablaAsesores = ({ asesores, cargando, onEditar, onBaja }) => {
  if (cargando) {
    return <div className="gadmin-empty">Cargando asesores...</div>;
  }

  if (!asesores || asesores.length === 0) {
    return <div className="gadmin-empty">No se encontraron asesores.</div>;
  }

  return (
    <div className="gadmin-table-wrap">
      <table className="gadmin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>NOMBRE COMPLETO</th>
            <th>ESPECIALIDAD</th>
            <th>CARGA ACTUAL</th>
            <th>ESTATUS</th>
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {asesores.map(a => (
            <tr
              key={a.idAsesor}
              className={!a.activo ? 'gadmin-row--inactivo' : ''}
            >
              <td style={{ color: '#9ca3af', fontSize: '.78rem' }}>
                #{a.idAsesor}
              </td>
              <td>
                <div style={{ fontWeight: 600 }}>{a.nombreCompleto}</div>
                <div style={{ fontSize: '.75rem', color: '#6b7280' }}>
                  {a.correo || '—'}
                </div>
              </td>
              <td>{a.especialidad || '—'}</td>
              <td style={{ textAlign: 'center' }}>
                <span style={{
                  background: '#eff6ff', color: '#1d4ed8',
                  borderRadius: 9999, padding: '2px 10px',
                  fontSize: '.75rem', fontWeight: 700,
                }}>
                  {a.cargaActual ?? 0}
                </span>
              </td>
              <td>
                <span className={`gadmin-badge ${
                  a.activo ? 'gadmin-badge--activo' : 'gadmin-badge--inactivo'
                }`}>
                  {a.activo ? 'Activo' : 'Baja'}
                </span>
              </td>
              <td>
                <div className="gadmin-row-actions">
                  <button
                    className="gadmin-icon-btn"
                    title="Modificar"
                    onClick={() => onEditar(a)}
                  >
                    <Pencil size={15} />
                  </button>
                  {a.activo && (
                    <button
                      className="gadmin-icon-btn gadmin-icon-btn--danger"
                      title="Dar de Baja"
                      onClick={() => onBaja(a)}
                    >
                      <UserX size={15} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};