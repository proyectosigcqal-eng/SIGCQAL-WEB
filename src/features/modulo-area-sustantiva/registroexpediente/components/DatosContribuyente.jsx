import React from 'react';

export const DatosContribuyente = ({ formData, erroresCampo, handleChange, handleFileChange, handleChangeNested, handleTipoPersonaChange, estados = [] }) => {
  return (
    <section className="form-section section-card">
      <div className="section-header">
        <h3 className="section-title">Datos del Contribuyente</h3>
      </div>
      <div className="section-body">
        <div className="toggle-container">
          <label>Tipo de Persona *</label>
          <div className="toggle-group">
            <button type="button" className={`toggle-btn ${formData.tipoPersona === 'fisica' ? 'active' : ''}`} onClick={() => handleTipoPersonaChange('fisica')}>
              Persona Física
            </button>
            <button type="button" className={`toggle-btn ${formData.tipoPersona === 'moral' ? 'active' : ''}`} onClick={() => handleTipoPersonaChange('moral')}>
              Persona Moral
            </button>
          </div>
        </div>

        {/* Renderizado condicional según el tipo de persona */}
        {formData.tipoPersona === 'fisica' ? (
          /* Contenedor exclusivo para los campos de nombre alineados en una sola fila */
          <div className="name-row-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre *</label>
              <input id="nombre" name="nombre" type="text" value={formData.nombre} onChange={handleChange} placeholder="Ingrese el nombre" className={erroresCampo.nombre ? 'campo-con-error' : ''} />
              {erroresCampo.nombre && <span className="error-text">{erroresCampo.nombre}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="apellidoPaterno">Apellido Paterno *</label>
              <input id="apellidoPaterno" name="apellidoPaterno" type="text" value={formData.apellidoPaterno} onChange={handleChange} placeholder="Ingrese el apellido paterno" className={erroresCampo.apellidoPaterno ? 'campo-con-error' : ''} />
              {erroresCampo.apellidoPaterno && <span className="error-text">{erroresCampo.apellidoPaterno}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="apellidoMaterno">Apellido Materno *</label>
              <input id="apellidoMaterno" name="apellidoMaterno" type="text" value={formData.apellidoMaterno} onChange={handleChange} placeholder="Ingrese el apellido materno" className={erroresCampo.apellidoMaterno ? 'campo-con-error' : ''} />
              {erroresCampo.apellidoMaterno && <span className="error-text">{erroresCampo.apellidoMaterno}</span>}
            </div>
          </div>
        ) : (
          /* Para Persona Moral la Razón Social ocupa el ancho completo */
          <div className="form-grid" style={{ marginBottom: '1.5rem' }}>
            <div className="form-group full-width">
              <label htmlFor="nombre">Razón Social *</label>
              <input id="nombre" name="nombre" type="text" value={formData.nombre} onChange={handleChange} placeholder="Ingrese la razón social" className={erroresCampo.nombre ? 'campo-con-error' : ''} />
              {erroresCampo.nombre && <span className="error-text">{erroresCampo.nombre}</span>}
            </div>
          </div>
        )}

        <section className="form-section section-card file-document-section">
          <div className="section-header">
            <h4 className="section-title">Documento de personalidad</h4>
          </div>
          <div className="section-body file-document-body">
            <div className="form-grid inline-fields">
              <div className="form-group">
                <label htmlFor="documentoPersonalidad">Documento que acredita personalidad</label>
                <input 
                  id="documentoPersonalidad" 
                  name="documentoPersonalidad" 
                  type="text" 
                  value={formData.documentoPersonalidad} 
                  onChange={handleChange} 
                  placeholder="Nombre del documento" 
                />
              </div>
              <div className="form-group file-upload-group">
                <label htmlFor="archivoDocumentoPersonalidad">Cargar documento</label>
                <div className="file-upload-row">
                  <label htmlFor="archivoDocumentoPersonalidad" className="file-upload-button">
                    Seleccionar archivo
                  </label>
                  <span className="file-upload-label">
                    {formData.archivoDocumentoPersonalidad?.name || 'Ningún archivo seleccionado'}
                  </span>
                </div>
                <input 
                  id="archivoDocumentoPersonalidad" 
                  name="archivoDocumentoPersonalidad" 
                  type="file" 
                  onChange={handleFileChange} 
                  className="hidden-file-input" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contenedor principal para los datos generales del contribuyente */}
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="rfc">RFC (Opcional)</label>
            <input 
              id="rfc" 
              name="rfc" 
              type="text" 
              value={formData.rfc} 
              onChange={handleChange} 
              placeholder="Ej. ABC123456XYZ" 
              maxLength="13" 
            />
          </div>

          <div className="form-group">
            <label htmlFor="rec">REC (Opcional)</label>
            <input id="rec" name="rec" type="text" value={formData.rec} onChange={handleChange} placeholder="Registro de Economista" />
          </div>

          <div className="form-group">
            <label htmlFor="identificacionTipo">Tipo de Identificación *</label>
            <select id="identificacionTipo" name="identificacionTipo" value={formData.identificacionTipo} onChange={handleChange} className={erroresCampo.identificacionTipo ? 'campo-con-error' : ''}>
              <option value="">Seleccionar tipo...</option>
              <option value="ine">INE</option>
              <option value="pasaporte">Pasaporte</option>
              <option value="curp">CURP</option>
              <option value="otro">Otro</option>
            </select>
            {erroresCampo.identificacionTipo && <span className="error-text">{erroresCampo.identificacionTipo}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="identificacionNumero">Número / Folio de Identificación *</label>
            <input id="identificacionNumero" name="identificacionNumero" type="text" value={formData.identificacionNumero} onChange={handleChange} placeholder="Número o folio" className={erroresCampo.identificacionNumero ? 'campo-con-error' : ''} />
            {erroresCampo.identificacionNumero && <span className="error-text">{erroresCampo.identificacionNumero}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="correoElectronico">Correo Electrónico</label>
            <input id="correoElectronico" name="correoElectronico" type="email" value={formData.correoElectronico} onChange={handleChange} placeholder="correo@ejemplo.com" />
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono</label>
            <input id="telefono" name="telefono" type="text" value={formData.telefono} onChange={handleChange} placeholder="(xxx) xxx-xxxx" />
          </div>
        </div>

        <div className="domicilio-section">
          <h4 className="domicilio-title">Desglose de Domicilio Fiscal</h4>
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="domicilioFiscal_calle">Calle *</label>
              <input id="domicilioFiscal_calle" type="text" value={formData.domicilioFiscal.calle} onChange={(e) => handleChangeNested('domicilioFiscal', 'calle', e.target.value)} placeholder="Nombre de la calle" className={erroresCampo['domicilioFiscal.calle'] ? 'campo-con-error' : ''} />
              {erroresCampo['domicilioFiscal.calle'] && <span className="error-text">{erroresCampo['domicilioFiscal.calle']}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="domicilioFiscal_numero">Número *</label>
              <input id="domicilioFiscal_numero" type="text" value={formData.domicilioFiscal.numero} onChange={(e) => handleChangeNested('domicilioFiscal', 'numero', e.target.value)} placeholder="Número exterior" className={erroresCampo['domicilioFiscal.numero'] ? 'campo-con-error' : ''} />
              {erroresCampo['domicilioFiscal.numero'] && <span className="error-text">{erroresCampo['domicilioFiscal.numero']}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="domicilioFiscal_numeroInterior">Número Interior (Opcional)</label>
              <input id="domicilioFiscal_numeroInterior" type="text" value={formData.domicilioFiscal.numeroInterior} onChange={(e) => handleChangeNested('domicilioFiscal', 'numeroInterior', e.target.value)} placeholder="Número interior" />
            </div>

            <div className="form-group">
              <label htmlFor="domicilioFiscal_colonia">Colonia *</label>
              <input id="domicilioFiscal_colonia" type="text" value={formData.domicilioFiscal.colonia} onChange={(e) => handleChangeNested('domicilioFiscal', 'colonia', e.target.value)} placeholder="Nombre de la colonia" className={erroresCampo['domicilioFiscal.colonia'] ? 'campo-con-error' : ''} />
              {erroresCampo['domicilioFiscal.colonia'] && <span className="error-text">{erroresCampo['domicilioFiscal.colonia']}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="domicilioFiscal_localidad">Localidad *</label>
              <input id="domicilioFiscal_localidad" type="text" value={formData.domicilioFiscal.localidad} onChange={(e) => handleChangeNested('domicilioFiscal', 'localidad', e.target.value)} placeholder="Localidad" className={erroresCampo['domicilioFiscal.localidad'] ? 'campo-con-error' : ''} />
              {erroresCampo['domicilioFiscal.localidad'] && <span className="error-text">{erroresCampo['domicilioFiscal.localidad']}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="domicilioFiscal_codigoPostal">Código Postal</label>
              <input id="domicilioFiscal_codigoPostal" type="text" value={formData.domicilioFiscal.codigoPostal} onChange={(e) => handleChangeNested('domicilioFiscal', 'codigoPostal', e.target.value)} placeholder="CP" maxLength="5" />
            </div>

            <div className="form-group">
              <label htmlFor="domicilioFiscal_estado">Estado</label>
              <select id="domicilioFiscal_estado" value={formData.domicilioFiscal.estado} onChange={(e) => handleChangeNested('domicilioFiscal', 'estado', e.target.value)}>
                <option value="">Seleccionar estado...</option>
                {estados.map((e) => (
                  <option key={e.id} value={e.id}>{e.nombre}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};