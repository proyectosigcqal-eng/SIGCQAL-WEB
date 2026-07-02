import React, { useState } from 'react';
import '../../../../features/modulo-area-sustantiva/audiencia-celebrada/styles/AudienciaCelebradaForm.css';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_Prod';

const ESTADO_INICIAL = {
  idAudienciaEspera:    '',
  fechaHoraCelebracion: '',
  numeroOficioActa:     '',
  salaOModalidad:       '',
  resultadoAudiencia:   '',
  asistioAutoridad:     'true',
};

const AudienciaCelebradaForm = () => {
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
      const res = await fetch(`${API_BASE}/api/sustantiva/audiencia-celebrada`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idAudienciaEspera:    Number(form.idAudienciaEspera),
          fechaHoraCelebracion: form.fechaHoraCelebracion || null,
          numeroOficioActa:     form.numeroOficioActa     || null,
          salaOModalidad:       form.salaOModalidad       || null,
          resultadoAudiencia:   form.resultadoAudiencia,
          asistioAutoridad:     form.asistioAutoridad === 'true',
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
      {exito && <div className="form-exito">✓ Audiencia celebrada registrada.</div>}

      <form className="audiencia-celebrada-form" onSubmit={handleSubmit}>
        <h3>Audiencia Celebrada</h3>
        <div className="form-grid">

          <div className="field">
            <label htmlFor="idAudienciaEspera">ID Audiencia Espera *</label>
            <input type="number" id="idAudienciaEspera" name="idAudienciaEspera"
              value={form.idAudienciaEspera} onChange={handleChange} required />
          </div>

          <div className="field">
            <label htmlFor="fechaHoraCelebracion">Fecha y Hora Celebración *</label>
            <input type="datetime-local" id="fechaHoraCelebracion" name="fechaHoraCelebracion"
              value={form.fechaHoraCelebracion} onChange={handleChange} required />
          </div>

          <div className="field">
            <label htmlFor="numeroOficioActa">Número de Oficio Acta</label>
            <input type="text" id="numeroOficioActa" name="numeroOficioActa"
              maxLength="100" value={form.numeroOficioActa} onChange={handleChange} />
          </div>

          <div className="field">
            <label htmlFor="salaOModalidad">Sala o Modalidad</label>
            <input type="text" id="salaOModalidad" name="salaOModalidad"
              maxLength="150" value={form.salaOModalidad} onChange={handleChange} />
          </div>

          <div className="field full-width">
            <label htmlFor="resultadoAudiencia">Resultado de la Audiencia *</label>
            <textarea id="resultadoAudiencia" name="resultadoAudiencia" rows="6"
              value={form.resultadoAudiencia} onChange={handleChange} required />
          </div>

          <div className="field">
            <label htmlFor="asistioAutoridad">¿Asistió la Autoridad? *</label>
            <select id="asistioAutoridad" name="asistioAutoridad"
              value={form.asistioAutoridad} onChange={handleChange} required>
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </div>

          <button type="submit" className="btn-submit" disabled={cargando}>
            {cargando ? 'Guardando...' : 'Guardar Audiencia'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AudienciaCelebradaForm;