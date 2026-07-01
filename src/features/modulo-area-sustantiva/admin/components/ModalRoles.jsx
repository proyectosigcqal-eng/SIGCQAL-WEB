import { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';

export const ModalRoles = ({ abierto, usuario, roles, onCerrar, onGuardar }) => {
  const [seleccionados, setSeleccionados] = useState([]);
  const [guardando,     setGuardando]     = useState(false);
  const [error,         setError]         = useState(null);

  useEffect(() => {
    if (usuario) {
      setSeleccionados(usuario.idRoles ?? []);
    }
    setError(null);
  }, [usuario, abierto]);

  if (!abierto) return null;

  const toggle = (id) =>
    setSeleccionados(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );

  const handleGuardar = async () => {
    console.log('>>> roles a guardar:', seleccionados); 
    setGuardando(true);
    setError(null);
    try {
      await onGuardar(usuario.id, seleccionados);
      onCerrar();
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="gadmin-overlay">
      <div className="gadmin-modal">
        <div className="gadmin-modal-header">
          <h2 className="gadmin-modal-title">
            Asignar Roles — {usuario?.usuarioLogin}
          </h2>
          <button className="gadmin-modal-close" onClick={onCerrar}>×</button>
        </div>

        <div className="gadmin-modal-body">
          {error && <div className="gadmin-alert-error">{error}</div>}

          <p style={{ fontSize: '.82rem', color: '#6b7280', margin: 0 }}>
            Selecciona los roles que tendrá este usuario.
            Sus permisos de acceso dependen de los roles asignados.
          </p>

          <div className="gadmin-roles-grid">
            {roles.map(rol => (
              <div
                key={rol.id}
                className={`gadmin-rol-item ${seleccionados.includes(rol.id) ? 'is-selected' : ''}`}
                onClick={() => toggle(rol.id)}
              >
                <ShieldCheck size={16} />
                {rol.nombre ?? rol.nombreRol}
              </div>
            ))}
          </div>

          {roles.length === 0 && (
            <p style={{ color: '#9ca3af', textAlign: 'center', fontSize: '.82rem' }}>
              No hay roles disponibles.
            </p>
          )}
        </div>

        <div className="gadmin-modal-footer">
          <button className="gadmin-btn gadmin-btn--neutral" onClick={onCerrar}>
            Cancelar
          </button>
          <button
            className="gadmin-btn gadmin-btn--roles"
            onClick={handleGuardar}
            disabled={guardando}
          >
            {guardando ? 'Guardando...' : 'Guardar Roles'}
          </button>
        </div>
      </div>
    </div>
  );
};