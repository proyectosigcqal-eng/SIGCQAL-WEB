import React, { useState } from 'react';
import '../../../../features/modulo-area-sustantiva/audiencia_espera/styles/AudienciaEsperaForm.css';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_dev';

const ESTADO_INICIAL = {
  idDemandaAmparo:       '',
  numeroOficioAdmision:  '',
  fechaNotificacionOficio: '',
  fechaHoraAudienciaProg:  '',
  observaciones:         '',
};

const AudienciaEsperaForm = () => {
  const [form, setForm]       = useState(ESTADO_INICIAL);
  const [cargando, setCargando] = useState(false);
  const [error, setError]     = useState(null);
  const [exito, setExito]     = useState(false);

  const handleChange = ({ target: { name, value } }) =>
    setForm(prev => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError(null);
    setExito(false);

    try {
      const res = await fetch(`${API_BASE}/api/sustantiva/audiencia-espera`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idDemandaAmparo:        Number(form.idDemandaAmparo),
          numeroOficioAdmision:   form.numeroOficioAdmision,
          fechaNotificacionOficio: form.fechaNotificacionOficio || null,
          fechaHoraAudienciaProg:  form.fechaHoraAudienciaProg  || null,
          observaciones:           form.observaciones            || null,
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
      {exito && <div className="form-exito">✓ Audiencia registrada correctamente.</div>}

      <form className="audiencia-form" onSubmit={handleSubmit}>
        <h3>Registro de Audiencia en Espera</h3>
        <div className="form-grid">

          <div className="field">
            <label htmlFor="idDemandaAmparo">ID Demanda Amparo *</label>
            <input type="number" id="idDemandaAmparo" name="idDemandaAmparo"
              value={form.idDemandaAmparo} onChange={handleChange} required />
          </div>

          <div className="field">
            <label htmlFor="numeroOficioAdmision">Número de Oficio Admisión *</label>
            <input type="text" id="numeroOficioAdmision" name="numeroOficioAdmision"
              maxLength="100" value={form.numeroOficioAdmision} onChange={handleChange} required />
          </div>

          <div className="field">
            <label htmlFor="fechaNotificacionOficio">Fecha Notificación Oficio *</label>
            <input type="date" id="fechaNotificacionOficio" name="fechaNotificacionOficio"
              value={form.fechaNotificacionOficio} onChange={handleChange} required />
          </div>

          <div className="field">
            <label htmlFor="fechaHoraAudienciaProg">Fecha y Hora Programada *</label>
            <input type="datetime-local" id="fechaHoraAudienciaProg" name="fechaHoraAudienciaProg"
              value={form.fechaHoraAudienciaProg} onChange={handleChange} required />
          </div>

          <div className="field full-width">
            <label htmlFor="observaciones">Observaciones</label>
            <textarea id="observaciones" name="observaciones" rows="6"
              value={form.observaciones} onChange={handleChange} />
          </div>

          <button type="submit" className="btn-submit" disabled={cargando}>
            {cargando ? 'Registrando...' : 'Registrar Audiencia'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AudienciaEsperaForm;