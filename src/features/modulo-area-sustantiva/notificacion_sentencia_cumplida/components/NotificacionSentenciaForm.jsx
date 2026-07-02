import React, { useState } from 'react';
import '../../../../features/modulo-area-sustantiva/notificacion_sentencia_cumplida/styles/NotificacionSentenciaForm.css';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_Prod';

const ESTADO_INICIAL = {
  idSentenciaEjecutoria:      '',
  fechaNotificacionArchivo:   '',
  numeroOficioCumplimiento:   '',
  numeroOficioArchivo:        '',
  observacionesFinales:       '',
};

const NotificacionSentenciaForm = () => {
  const [form, setForm]         = useState(ESTADO_INICIAL);
  const [cargando, setCargando] = useState(false);
  const [error, setError]       = useState(null);
  const [exito, setExito]       = useState(false);

  const handleChange = ({ target: { name, value } }) =>
    setForm(prev => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError(null);
    setExito(false);

    try {
      const res = await fetch(`${API_BASE}/api/sustantiva/notificacion-sentencia-cumplida`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idSentenciaEjecutoria:    Number(form.idSentenciaEjecutoria),
          fechaNotificacionArchivo: form.fechaNotificacionArchivo || null,
          numeroOficioCumplimiento: form.numeroOficioCumplimiento,
          numeroOficioArchivo:      form.numeroOficioArchivo,
          observacionesFinales:     form.observacionesFinales || null,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail ?? `Error ${res.status}`);
      }

      setExito(true);
      setForm(ESTADO_INICIAL);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="form-container">
      {error && <div className="form-error">⚠ {error}</div>}
      {exito && <div className="form-exito">✓ Notificación guardada correctamente.</div>}

      <form className="sentencia-form" onSubmit={handleSubmit}>
        <h3>Notificación Sentencia Cumplida</h3>
        <div className="form-grid">

          <div className="field">
            <label htmlFor="idSentenciaEjecutoria">ID Sentencia Ejecutoria *</label>
            <input type="number" id="idSentenciaEjecutoria" name="idSentenciaEjecutoria"
              value={form.idSentenciaEjecutoria} onChange={handleChange} required />
          </div>

          <div className="field">
            <label htmlFor="fechaNotificacionArchivo">Fecha Notificación Archivo *</label>
            <input type="date" id="fechaNotificacionArchivo" name="fechaNotificacionArchivo"
              value={form.fechaNotificacionArchivo} onChange={handleChange} required />
          </div>

          <div className="field">
            <label htmlFor="numeroOficioCumplimiento">Número de Oficio Cumplimiento *</label>
            <input type="text" id="numeroOficioCumplimiento" name="numeroOficioCumplimiento"
              maxLength="100" value={form.numeroOficioCumplimiento} onChange={handleChange} required />
          </div>

          <div className="field">
            <label htmlFor="numeroOficioArchivo">Número de Oficio Archivo *</label>
            <input type="text" id="numeroOficioArchivo" name="numeroOficioArchivo"
              maxLength="100" value={form.numeroOficioArchivo} onChange={handleChange} required />
          </div>

          <div className="field full-width">
            <label htmlFor="observacionesFinales">Observaciones Finales</label>
            <textarea id="observacionesFinales" name="observacionesFinales" rows="6"
              value={form.observacionesFinales} onChange={handleChange} />
          </div>

          <button type="submit" className="btn-submit" disabled={cargando}>
            {cargando ? 'Guardando...' : 'Guardar Notificación'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NotificacionSentenciaForm;