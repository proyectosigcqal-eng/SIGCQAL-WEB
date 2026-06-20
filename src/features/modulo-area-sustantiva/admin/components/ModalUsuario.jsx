import { useState, useEffect } from 'react';

export const ModalUsuario = ({ abierto, onCerrar, onGuardar, areas = [] }) => {
  const [form, setForm] = useState({
    nombre:          '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    usuarioLogin:    '',
    password:        '',
    correo:          '',
    idArea:          '',
  });
  const [guardando, setGuardando] = useState(false);
  const [error,     setError]     = useState(null);

  useEffect(() => {
    if (abierto) {
      setForm({
        nombre: '', apellidoPaterno: '', apellidoMaterno: '',
        usuarioLogin: '', password: '', correo: '', idArea: '',
      });
      setError(null);
    }
  }, [abierto]);

  if (!abierto) return null;

  const campo = (label, key, type = 'text', placeholder = '', req = false) => (
    <div className="gadmin-field">
      <label>
        {label}{req && <span style={{ color: '#dc2626' }}> *</span>}
      </label>
      <input
        type={type}
        value={form[key]}
        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        placeholder={placeholder}
        autoComplete={type === 'password' ? 'new-password' : 'off'}
      />
    </div>
  );

  const handleGuardar = async () => {
    if (!form.nombre || !form.apellidoPaterno || !form.usuarioLogin || !form.password) {
      setError('Nombre, apellido paterno, usuario y contraseña son obligatorios.');
      return;
    }
    setGuardando(true);
    setError(null);
    try {
      await onGuardar(form);
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
          <h2 className="gadmin-modal-title">Alta de Usuario</h2>
          <button className="gadmin-modal-close" onClick={onCerrar}>×</button>
        </div>

        <div className="gadmin-modal-body">
          {error && <div className="gadmin-alert-error">{error}</div>}

          <div className="gadmin-grid-2">
            {campo('Nombre', 'nombre', 'text', 'Nombre(s)', true)}
            {campo('Apellido Paterno', 'apellidoPaterno', 'text', 'Apellido paterno', true)}
          </div>

          <div className="gadmin-grid-2">
            {campo('Apellido Materno', 'apellidoMaterno', 'text', 'Apellido materno')}
            {campo('Correo Electrónico', 'correo', 'email', 'correo@ejemplo.com')}
          </div>

          <div className="gadmin-grid-2">
            {campo('Usuario (login)', 'usuarioLogin', 'text', 'Ej: juan.perez', true)}
            {campo('Contraseña', 'password', 'password', '••••••••', true)}
          </div>

          <div className="gadmin-field">
            <label>Área</label>
            <select
              value={form.idArea}
              onChange={e => setForm(p => ({ ...p, idArea: e.target.value }))}
            >
              <option value="">Seleccionar área...</option>
              {areas.map(a => (
                <option key={a.idArea ?? a.id} value={a.idArea ?? a.id}>
                  {a.nombreArea ?? a.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="gadmin-modal-footer">
          <button className="gadmin-btn gadmin-btn--neutral" onClick={onCerrar}>
            Cancelar
          </button>
          <button
            className="gadmin-btn gadmin-btn--alta"
            onClick={handleGuardar}
            disabled={guardando}
          >
            {guardando ? 'Guardando...' : 'Crear Usuario'}
          </button>
        </div>
      </div>
    </div>
  );
};