import React, { useState } from 'react';
import '../../../../features/modulo-area-sustantiva/sentencia_ejecutoria/styles/SentenciaEjecutoriaForm.css';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_dev';

const ESTADO_INICIAL = {
  idSentencia:                '',
  idRecursoRevision:          '',
  numeroOficioEjecutoria:     '',
  fechaDeclaracionEjecutoria: '',
  requerimientoCumplimiento:  '',
};

const SentenciaEjecutoriaForm = () => {
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
      const res = await fetch(`${API_BASE}/api/sustantiva/sentencia-ejecutoria`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idSentencia:                Number(form.idSentencia),
          // idRecursoRevision es opcional — solo se envía si tiene valor
          idRecursoRevision:          form.idRecursoRevision ? Number(form.idRecursoRevision) : null,
          numeroOficioEjecutoria:     form.numeroOficioEjecutoria,
          fechaDeclaracionEjecutoria: form.fechaDeclaracionEjecutoria || null,
          requerimientoCumplimiento:  form.requerimientoCumplimiento  || null,
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
      {exito && <div className="form-exito">✓ Sentencia ejecutoria guardada.</div>}

      <form className="ejecutoria-form" onSubmit={handleSubmit}>
        <h3>Registro de Sentencia Ejecutoria</h3>
        <div className="form-grid">

          <div className="field">
            <label htmlFor="idSentencia">ID Sentencia *</label>
            <input type="number" id="idSentencia" name="idSentencia"
              value={form.idSentencia} onChange={handleChange} required />
          </div>

          <div className="field">
            <label htmlFor="idRecursoRevision">ID Recurso de Revisión <span style={{color:'#888', fontSize:'0.85rem'}}>(opcional)</span></label>
            <input type="number" id="idRecursoRevision" name="idRecursoRevision"
              value={form.idRecursoRevision} onChange={handleChange} />
          </div>

          <div className="field">
            <label htmlFor="numeroOficioEjecutoria">Número de Oficio *</label>
            <input type="text" id="numeroOficioEjecutoria" name="numeroOficioEjecutoria"
              maxLength="100" value={form.numeroOficioEjecutoria} onChange={handleChange} required />
          </div>

          <div className="field">
            <label htmlFor="fechaDeclaracionEjecutoria">Fecha Declaración *</label>
            <input type="date" id="fechaDeclaracionEjecutoria" name="fechaDeclaracionEjecutoria"
              value={form.fechaDeclaracionEjecutoria} onChange={handleChange} required />
          </div>

          <div className="field full-width">
            <label htmlFor="requerimientoCumplimiento">Requerimiento de Cumplimiento</label>
            <textarea id="requerimientoCumplimiento" name="requerimientoCumplimiento" rows="4"
              value={form.requerimientoCumplimiento} onChange={handleChange} />
          </div>

          <button type="submit" className="btn-submit" disabled={cargando}>
            {cargando ? 'Guardando...' : 'Guardar Sentencia Ejecutoria'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SentenciaEjecutoriaForm;