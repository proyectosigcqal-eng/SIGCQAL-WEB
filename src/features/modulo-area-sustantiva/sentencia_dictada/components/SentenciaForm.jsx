import React, { useState } from 'react';
import '../../../../features/modulo-area-sustantiva/sentencia_dictada/styles/SentenciaForm.css';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_dev';

const ESTADO_INICIAL = {
  idAudienciaCelebrada:       '',
  fechaDictado:               '',
  fechaNotificacionSentencia: '',
  sentidoFallo:               '',
  puntosResolutivos:          '',
  numeroOficioSentencia:      '',
  rutaArchivoSentencia:       '',
};

const SentenciaForm = () => {
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
      const res = await fetch(`${API_BASE}/api/sustantiva/sentencia-dictada`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idAudienciaCelebrada:       Number(form.idAudienciaCelebrada),
          fechaDictado:               form.fechaDictado               || null,
          fechaNotificacionSentencia: form.fechaNotificacionSentencia || null,
          sentidoFallo:               form.sentidoFallo,
          puntosResolutivos:          form.puntosResolutivos,
          numeroOficioSentencia:      form.numeroOficioSentencia      || null,
          rutaArchivoSentencia:       form.rutaArchivoSentencia       || null,
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
      {exito && <div className="form-exito">✓ Sentencia registrada correctamente.</div>}

      <form className="sentencia-form" onSubmit={handleSubmit}>
        <h3>Registro de Sentencia Dictada</h3>
        <div className="form-grid">

          <div className="field">
            <label htmlFor="idAudienciaCelebrada">ID Audiencia *</label>
            <input type="number" id="idAudienciaCelebrada" name="idAudienciaCelebrada"
              value={form.idAudienciaCelebrada} onChange={handleChange} required />
          </div>

          <div className="field" style={{ visibility: 'hidden' }} />

          <div className="field">
            <label htmlFor="fechaDictado">Fecha de Dictado *</label>
            <input type="date" id="fechaDictado" name="fechaDictado"
              value={form.fechaDictado} onChange={handleChange} required />
          </div>

          <div className="field">
            <label htmlFor="fechaNotificacionSentencia">Fecha de Notificación *</label>
            <input type="date" id="fechaNotificacionSentencia" name="fechaNotificacionSentencia"
              value={form.fechaNotificacionSentencia} onChange={handleChange} required />
          </div>

          <div className="field full-width">
            <label htmlFor="sentidoFallo">Sentido del Fallo *</label>
            <input type="text" id="sentidoFallo" name="sentidoFallo"
              maxLength="100" value={form.sentidoFallo} onChange={handleChange} required />
          </div>

          <div className="field full-width">
            <label htmlFor="puntosResolutivos">Puntos Resolutivos *</label>
            <textarea id="puntosResolutivos" name="puntosResolutivos" rows="5"
              value={form.puntosResolutivos} onChange={handleChange} required />
          </div>

          <div className="field">
            <label htmlFor="numeroOficioSentencia">Número de Oficio</label>
            <input type="text" id="numeroOficioSentencia" name="numeroOficioSentencia"
              maxLength="100" value={form.numeroOficioSentencia} onChange={handleChange} />
          </div>

          <div className="field">
            <label htmlFor="rutaArchivoSentencia">Ruta del Archivo</label>
            <input type="text" id="rutaArchivoSentencia" name="rutaArchivoSentencia"
              maxLength="500" value={form.rutaArchivoSentencia} onChange={handleChange} />
          </div>

          <button type="submit" className="btn-submit" disabled={cargando}>
            {cargando ? 'Registrando...' : 'Registrar Sentencia'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SentenciaForm;