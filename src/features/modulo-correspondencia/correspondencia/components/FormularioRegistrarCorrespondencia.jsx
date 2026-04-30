import React from 'react';

export const FormularioRegistrarCorrespondencia = ({ formData, handleChange, handleSubmit, catalogos, loading }) => {
  const areas = catalogos?.areas || [];
  const usuarios = catalogos?.usuarios || [];

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid-corr">
        <div className="form-group-corr">
          <label htmlFor="numeroOficio">Número de Oficio *</label>
          <input
            id="numeroOficio"
            name="numeroOficio"
            type="text"
            required
            value={formData.numeroOficio}
            onChange={handleChange}
          />
        </div>

        <div className="form-group-corr">
          <label htmlFor="fechaExpedicion">Fecha de Expedición *</label>
          <input
            id="fechaExpedicion"
            name="fechaExpedicion"
            type="date"
            required
            value={formData.fechaExpedicion}
            onChange={handleChange}
          />
        </div>

        <div className="form-group-corr">
          <label htmlFor="dependenciaRemitente">Dependencia Remitente *</label>
          <input
            id="dependenciaRemitente"
            name="dependenciaRemitente"
            type="text"
            required
            value={formData.dependenciaRemitente}
            onChange={handleChange}
          />
        </div>

        <div className="form-group-corr">
          <label htmlFor="titularDependencia">Titular de la Dependencia *</label>
          <input
            id="titularDependencia"
            name="titularDependencia"
            type="text"
            required
            value={formData.titularDependencia}
            onChange={handleChange}
          />
        </div>

        <div className="form-group-corr full-width">
          <label htmlFor="asunto">Asunto *</label>
          <textarea
            id="asunto"
            name="asunto"
            required
            rows={3}
            value={formData.asunto}
            onChange={handleChange}
          />
        </div>

        <div className="form-group-corr">
          <label htmlFor="fechaRecibido">Fecha Recibido *</label>
          <input
            id="fechaRecibido"
            name="fechaRecibido"
            type="date"
            required
            value={formData.fechaRecibido}
            onChange={handleChange}
          />
        </div>

        <div className="form-group-corr">
          <label htmlFor="idArea">Área Asignada *</label>
          <select id="idArea" name="idArea" required value={formData.idArea} onChange={handleChange}>
            <option value="">Selecciona un área</option>
            {areas.map((a) => {
              const id = a?.idArea ?? a?.id_area ?? a?.id;
              const label = a?.nombreArea ?? a?.nombre_area ?? a?.nombre ?? `Área ${id}`;
              return (
                <option key={id} value={id}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>

        <div className="form-group-corr">
          <label htmlFor="idUsuarioCaptura">Usuario Captura</label>
          <select
            id="idUsuarioCaptura"
            name="idUsuarioCaptura"
            value={formData.idUsuarioCaptura}
            onChange={handleChange}
          >
            <option value="">Selecciona un usuario</option>
            {usuarios.map((u) => {
              const id = u?.idUsuario ?? u?.id_usuario ?? u?.id;
              const label = u?.nombreCompleto ?? u?.nombre_completo ?? u?.nombre ?? `Usuario ${id}`;
              return (
                <option key={id} value={id}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>

        <div className="form-group-corr full-width">
          <label htmlFor="observaciones">Observaciones</label>
          <textarea
            id="observaciones"
            name="observaciones"
            rows={3}
            value={formData.observaciones}
            onChange={handleChange}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
        <button type="submit" className="btn-primario-corr" disabled={loading}>
          Registrar Correspondencia
        </button>
      </div>
    </form>
  );
};

