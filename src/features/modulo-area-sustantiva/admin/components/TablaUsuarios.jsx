import { ShieldCheck, UserX } from 'lucide-react';

export const TablaUsuarios = ({ usuarios, roles, cargando, onRoles, onBaja }) => {
  if (cargando) {
    return <div className="gadmin-empty">Cargando usuarios...</div>;
  }

  if (!usuarios || usuarios.length === 0) {
    return <div className="gadmin-empty">No se encontraron usuarios.</div>;
  }

  return (
    <div className="gadmin-table-wrap">
      <table className="gadmin-table">
        <thead>
          <tr>
            <th>USUARIO</th>
            <th>ÁREA</th>
            <th>CORREO</th>
            <th>ROLES</th>
            <th>ESTATUS</th>
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(u => (
            <tr
              key={u.id}
              className={!u.activo ? 'gadmin-row--inactivo' : ''}
            >
              <td>
                <div style={{ fontWeight: 600 }}>{u.usuarioLogin}</div>
                <div style={{ fontSize: '.75rem', color: '#6b7280' }}>
                  ID #{u.id}
                </div>
              </td>
              <td>{u.nombreArea || '—'}</td>
              <td style={{ fontSize: '.82rem' }}>
                {u.correoElectronico || '—'}
              </td>
              <td>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {(u.idRoles ?? []).length === 0 ? (
                    <span style={{ color: '#9ca3af', fontSize: '.75rem' }}>
                      Sin roles
                    </span>
                  ) : (u.idRoles ?? []).map(id => {
                    const rol = roles?.find(r => r.id === id);
                    return (
                      <span key={id} className="gadmin-badge gadmin-badge--rol">
                        {rol?.nombre ?? rol?.nombreRol ?? `Rol #${id}`}
                      </span>
                    );
                  })}
                </div>
              </td>
              <td>
                <span className={`gadmin-badge ${
                  u.activo ? 'gadmin-badge--activo' : 'gadmin-badge--inactivo'
                }`}>
                  {u.activo ? 'Activo' : 'Baja'}
                </span>
              </td>
              <td>
                <div className="gadmin-row-actions">
                  <button
                    className="gadmin-icon-btn gadmin-icon-btn--roles"
                    title="Asignar Roles"
                    onClick={() => onRoles(u)}
                  >
                    <ShieldCheck size={15} />
                  </button>
                  {u.activo && (
                    <button
                      className="gadmin-icon-btn gadmin-icon-btn--danger"
                      title="Dar de Baja"
                      onClick={() => onBaja(u)}
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