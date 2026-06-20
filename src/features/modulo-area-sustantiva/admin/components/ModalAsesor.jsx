import { useState, useEffect } from 'react';

export const ModalAsesor = ({ abierto, asesor, onCerrar, onGuardar }) => {
  const [form, setForm] = useState({
    nombre: '', apellidoPaterno: '', apellidoMaterno: '',
    especialidad: '', rfc: '', correo: '', telefono: '',
  });
  const [guardando, setGuardando] = useState(false);
  const [error,     setError]     = useState(null);

  useEffect(() => {
    if (asesor) {
      setForm({
        nombre:          asesor.nombre          ?? '',
        apellidoPaterno: asesor.apellidoPaterno ?? '',
        apellidoMaterno: asesor.apellidoMaterno ?? '',
        especialidad:    asesor.especialidad    ?? '',
        rfc:             asesor.rfc             ?? '',
        correo:          asesor.correo          ?? '',
        telefono:        asesor.telefono        ?? '',
      });
    } else {
      setForm({ nombre:'', apellidoPaterno:'', apellidoMaterno:'',
                especialidad:'', rfc:'', correo:'', telefono:'' });
    }
    setError(null);
  }, [asesor, abierto]);

  if (!abierto) return null;

  const campo = (label, key, placeholder, req) => (
    <div className="gadmin-field">
      <label>{label}{req && <span style={{color:'#dc2626'}}> *</span>}</label>
      <input
        value={form[key]}
        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        placeholder={placeholder}
      />
    </div>
  );

  const handleGuardar = async () => {
    if (!form.nombre || !form.apellidoPaterno) {
      setError('Nombre y Apellido Paterno son obligatorios.');
      return;
    }
    setGuardando(true);
    setError(null);
    try {
      await onGuardar(form, asesor?.idAsesor);
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
            {asesor ? 'Modificar Asesor' : 'Alta de Asesor'}
          </h2>
          <button className="gadmin-modal-close" onClick={onCerrar}>×</button>
        </div>

        <div className="gadmin-modal-body">
          {error && <div className="gadmin-alert-error">{error}</div>}

          <div className="gadmin-grid-2">
            {campo('Nombre', 'nombre', 'Nombre(s)', true)}
            {campo('Apellido Paterno', 'apellidoPaterno', 'Apellido paterno', true)}
          </div>
          <div className="gadmin-grid-2">
            {campo('Apellido Materno', 'apellidoMaterno', 'Apellido materno', false)}
            {campo('Especialidad', 'especialidad', 'Ej: Derecho Fiscal', false)}
          </div>
          <div className="gadmin-grid-2">
            {campo('RFC', 'rfc', 'RFC', false)}
            {campo('Teléfono', 'telefono', '(492) 000-0000', false)}
          </div>
          {campo('Correo Electrónico', 'correo', 'correo@ejemplo.com', false)}
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
            {guardando ? 'Guardando...' : asesor ? 'Guardar Cambios' : 'Dar de Alta'}
          </button>
        </div>
      </div>
    </div>
  );
};