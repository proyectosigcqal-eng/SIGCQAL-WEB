import React from 'react';
import '../styles/memorandum.css';

export const FormularioMemorandum = ({ formData, setFormData, handleChange, handleSubmit, catalogos }) => {

  const { usuarios = [], plantillas = [], cargandoCatalogos = false } = catalogos || {};

  const getAreaUsuario = (userId) => {
    if (!userId) return "Sin asignar";
    const usuario = usuarios.find(u => u.id === Number(userId));
    return usuario && usuario.nombreArea ? usuario.nombreArea : "Sin asignar";
  };


  const handleEmisorChange = (e) => {
    const userId = e.target.value;
    const usuarioSeleccionado = usuarios.find(u => u.id === Number(userId));

    setFormData(prev => ({
      ...prev,
      idUsuarioEmisor: userId !== '' ? Number(userId) : '',
      idArea: usuarioSeleccionado && usuarioSeleccionado.idArea ? Number(usuarioSeleccionado.idArea) : ''
    }));
  };

  return (
    <form className="memorandum-form-container" onSubmit={handleSubmit}>

      <div className="form-row">
        <div className="form-group">
          <label>Dependencia General</label>
          <input 
            type="text" 
            value="DIRECCIÓN ADMINISTRATIVA DE LA COMISIÓN ESTATAL..." 
            disabled 
            className="input-readonly"
          />
        </div>
        <div className="form-group">
          <label>No. Oficio</label>
          <input 
            type="text" 
            value={formData.folioUnico} 
            disabled 
            className="input-readonly"
          />
        </div>
      </div>

      <div className="form-group full-width">
        <label>Asunto</label>
        <textarea
          name="asuntoCorrespondencia"
          value={formData.asuntoCorrespondencia}
          onChange={handleChange}
          rows="2"
        />
      </div>

      <div className="form-group full-width">
        <label>Observaciones (Internas)</label>
        <textarea
          name="observaciones"
          value={formData.observaciones}
          onChange={handleChange}
          rows="2"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Elaboró</label>
          <select name="idUsuarioEmisor" value={formData.idUsuarioEmisor} onChange={handleEmisorChange}>
            <option value="">Seleccione...</option>
            {usuarios.map(u => <option key={u.id} value={u.id}>{u.usuarioLogin}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Dependencia</label>
          <input 
            type="text" 
            value={getAreaUsuario(formData.idUsuarioEmisor)} 
            disabled 
            className="input-readonly"
            placeholder="Se cargará automáticamente"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Firmante</label>
          <select name="idUsuarioFirmante" value={formData.idUsuarioFirmante} onChange={handleChange}>
            <option value="">Seleccione...</option>
            {usuarios.map(u => <option key={u.id} value={u.id}>{u.usuarioLogin}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Dependencia</label>
          <input 
            type="text" 
            value={getAreaUsuario(formData.idUsuarioFirmante)} 
            disabled 
            className="input-readonly"
            placeholder="Se cargará automáticamente"
          />
        </div>
      </div>

      {/* Plantilla */}
      <div className="form-row">
        <div className="form-group half-width">
          <label>Plantilla</label>
          <select name="idPlantilla" value={formData.idPlantilla} onChange={handleChange}>
            <option value="">Seleccione...</option>
            {plantillas.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
        </div>
      </div>

      {/* Cuerpo del Documento */}
      <div className="form-group full-width rich-text-area">
        <div className="toolbar-mockup">
          <span className="tool-btn">B</span>
          <span className="tool-btn">I</span>
          <span className="tool-btn">U</span>
        </div>
        <textarea
          name="instruccionSeguimiento"
          placeholder="Escriba el contenido del memorándum..."
          value={formData.instruccionSeguimiento}
          onChange={handleChange}
          className="cuerpo-documento"
          rows="10"
        />
      </div>

      <button type="submit" className="btn-primario" disabled={cargandoCatalogos}>
        {cargandoCatalogos ? 'Cargando...' : 'Asignar Área'}
      </button>
    </form>
  );
};