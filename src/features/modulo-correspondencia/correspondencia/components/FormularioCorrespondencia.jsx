import React from 'react';

const DEPENDENCIAS = [
  'Secretaría de la Función Pública',
  'ISSSTEZAC',
  'Consejo de Armonización Contable del Estado de Tlaxcala',
  'Secretaría de Administración - Recursos Humanos',
  'IZAI (Instituto de Transparencia)',
  'Secretaría de Finanzas',
  'Otras dependencias estatales',
  'Otras dependencias federales'
];

export const FormularioCorrespondencia = ({
  formData,
  erroresCampo,
  handleChange,
  isLoading,
  errorGlobal
}) => {
  const getClassName = (name) => {
    const base = 'form-group-corr';
    const extra = erroresCampo?.[name] ? ' campo-con-error' : '';
    return `${base}${extra}`;
  };

  const inputClassName = (name) => (erroresCampo?.[name] ? 'campo-con-error' : '');

  return (
    <div>
      {errorGlobal ? <div className="alerta-error">{errorGlobal}</div> : null}

      <div className="form-section-title">Datos del oficio</div>
      <div className="form-grid-corr">
        <div className={getClassName('numeroOficio')}>
          <label htmlFor="numeroOficio">No. Oficio</label>
          <input
            id="numeroOficio"
            name="numeroOficio"
            type="text"
            placeholder="Ej. SEFIN/001/2026"
            value={formData.numeroOficio}
            onChange={handleChange}
            disabled={isLoading}
            className={inputClassName('numeroOficio')}
          />
          {erroresCampo?.numeroOficio ? (
            <span className="campo-error-msg">{erroresCampo.numeroOficio}</span>
          ) : null}
        </div>

        <div className={getClassName('fechaExpedicion')}>
          <label htmlFor="fechaExpedicion">Fecha de Expedición</label>
          <input
            id="fechaExpedicion"
            name="fechaExpedicion"
            type="date"
            value={formData.fechaExpedicion}
            onChange={handleChange}
            disabled={isLoading}
            max={formData.fechaRecibido || undefined}
            className={inputClassName('fechaExpedicion')}
          />
          {erroresCampo?.fechaExpedicion ? (
            <span className="campo-error-msg">{erroresCampo.fechaExpedicion}</span>
          ) : null}
        </div>

        <div className={getClassName('dependenciaRemitente')}>
          <label htmlFor="dependenciaRemitente">Dependencia Remitente</label>
          <select
            id="dependenciaRemitente"
            name="dependenciaRemitente"
            value={formData.dependenciaRemitente}
            onChange={handleChange}
            disabled={isLoading}
            className={inputClassName('dependenciaRemitente')}
          >
            <option value="">Selecciona una opción…</option>
            {DEPENDENCIAS.map((dep) => (
              <option key={dep} value={dep}>
                {dep}
              </option>
            ))}
          </select>
          {erroresCampo?.dependenciaRemitente ? (
            <span className="campo-error-msg">{erroresCampo.dependenciaRemitente}</span>
          ) : null}
        </div>

        <div className="form-group-corr">
          <label htmlFor="titularDependencia">Titular de la Dependencia</label>
          <input
            id="titularDependencia"
            name="titularDependencia"
            type="text"
            placeholder="Nombre de quien firma"
            value={formData.titularDependencia}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className={`form-group-corr full-width${erroresCampo?.asunto ? ' campo-con-error' : ''}`}>
          <label htmlFor="asunto">Asunto</label>
          <textarea
            id="asunto"
            name="asunto"
            rows={3}
            value={formData.asunto}
            onChange={handleChange}
            disabled={isLoading}
            className={inputClassName('asunto')}
          />
          {erroresCampo?.asunto ? <span className="campo-error-msg">{erroresCampo.asunto}</span> : null}
        </div>

        <div className={getClassName('fechaRecibido')}>
          <label htmlFor="fechaRecibido">Fecha de Recibido</label>
          <input
            id="fechaRecibido"
            name="fechaRecibido"
            type="date"
            value={formData.fechaRecibido}
            onChange={handleChange}
            disabled={isLoading}
            className={inputClassName('fechaRecibido')}
          />
          {erroresCampo?.fechaRecibido ? (
            <span className="campo-error-msg">{erroresCampo.fechaRecibido}</span>
          ) : null}
        </div>

        <div className="form-group-corr full-width">
          <label htmlFor="observaciones">Observaciones</label>
          <textarea
            id="observaciones"
            name="observaciones"
            rows={2}
            value={formData.observaciones}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
