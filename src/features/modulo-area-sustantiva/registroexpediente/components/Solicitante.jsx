import React, { useState, useEffect } from 'react';

export const SolicitanteRepresentante = ({ 
  formData, 
  erroresCampo = {}, 
  handleChangeNested 
}) => {
  // Estados para controlar los switches de "Soy yo"
  const [esRepresentanteYo, setEsRepresentanteYo] = useState(false);
  const [esSolicitanteYo, setEsSolicitanteYo] = useState(false);

  // Determinar si es persona moral para bloquear ÚNICAMENTE los switches
  const esPersonaMoral = formData.tipoPersona === 'moral';

  // Si cambian a Persona Moral en el formulario principal, 
  // apagamos los switches automáticamente para que no jalen la Razón Social.
  useEffect(() => {
    if (esPersonaMoral) {
      if (esRepresentanteYo) {
        setEsRepresentanteYo(false);
        handleChangeNested('representanteLegal', 'nombre', '');
        handleChangeNested('representanteLegal', 'apellidoPaterno', '');
        handleChangeNested('representanteLegal', 'apellidoMaterno', '');
      }
      if (esSolicitanteYo) {
        setEsSolicitanteYo(false);
        handleChangeNested('solicitante', 'nombre', '');
        handleChangeNested('solicitante', 'apellidoPaterno', '');
        handleChangeNested('solicitante', 'apellidoMaterno', '');
      }
    }
  }, [esPersonaMoral]);

  // Manejador para el switch de Representante Legal
  const handleToggleRepresentante = () => {
    if (esPersonaMoral) return; // Protección por si acaso
    const nuevoEstado = !esRepresentanteYo;
    setEsRepresentanteYo(nuevoEstado);

    if (nuevoEstado) {
      handleChangeNested('representanteLegal', 'nombre', formData.nombre || '');
      handleChangeNested('representanteLegal', 'apellidoPaterno', formData.apellidoPaterno || '');
      handleChangeNested('representanteLegal', 'apellidoMaterno', formData.apellidoMaterno || '');
    } else {
      handleChangeNested('representanteLegal', 'nombre', '');
      handleChangeNested('representanteLegal', 'apellidoPaterno', '');
      handleChangeNested('representanteLegal', 'apellidoMaterno', '');
    }
  };

  // Manejador para el switch de Nombre del Solicitante
  const handleToggleSolicitante = () => {
    if (esPersonaMoral) return; // Protección por si acaso
    const nuevoEstado = !esSolicitanteYo;
    setEsSolicitanteYo(nuevoEstado);

    if (nuevoEstado) {
      handleChangeNested('solicitante', 'nombre', formData.nombre || '');
      handleChangeNested('solicitante', 'apellidoPaterno', formData.apellidoPaterno || '');
      handleChangeNested('solicitante', 'apellidoMaterno', formData.apellidoMaterno || '');
    } else {
      handleChangeNested('solicitante', 'nombre', '');
      handleChangeNested('solicitante', 'apellidoPaterno', '');
      handleChangeNested('solicitante', 'apellidoMaterno', '');
    }
  };

  return (
    <section className="form-section section-card">
      <div className="section-header">
        <h3 className="section-title">Solicitante / Representante Legal</h3>
      </div>

      <div className="section-body">
        {/* ================= BLOQUE REPRESENTANTE LEGAL ================= */}
        <div className="sub-section-block" style={{ marginBottom: '2rem' }}>
          <div className="section-header-inline">
            <h4 className="domicilio-title" style={{ margin: 0 }}>Nombre del Representante Legal o Apoderado Legal</h4>
            
            <div className={`switch-wrapper ${esPersonaMoral ? 'switch-disabled' : ''}`}>
              <span className="switch-label">Soy yo</span>
              <label className="switch-component">
                <input 
                  type="checkbox" 
                  checked={esRepresentanteYo} 
                  onChange={handleToggleRepresentante} 
                  disabled={esPersonaMoral} /* El switch SÍ se bloquea si es moral */
                />
                <span className="switch-slider"></span>
              </label>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="rep_nombre">Nombre *</label>
              <input
                id="rep_nombre"
                type="text"
                value={formData.representanteLegal?.nombre || ''}
                onChange={(e) => handleChangeNested('representanteLegal', 'nombre', e.target.value)}
                placeholder="Nombre(s)"
                disabled={esRepresentanteYo} /* Deshabilitado SÓLO si el switch está encendido */
                className={erroresCampo['representanteLegal.nombre'] ? 'campo-con-error' : ''}
              />
              {erroresCampo['representanteLegal.nombre'] && <span className="error-text">{erroresCampo['representanteLegal.nombre']}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="rep_apellidoPaterno">Apellido Paterno *</label>
              <input
                id="rep_apellidoPaterno"
                type="text"
                value={formData.representanteLegal?.apellidoPaterno || ''}
                onChange={(e) => handleChangeNested('representanteLegal', 'apellidoPaterno', e.target.value)}
                placeholder="Apellido paterno"
                disabled={esRepresentanteYo} /* Deshabilitado SÓLO si el switch está encendido */
                className={erroresCampo['representanteLegal.apellidoPaterno'] ? 'campo-con-error' : ''}
              />
              {erroresCampo['representanteLegal.apellidoPaterno'] && <span className="error-text">{erroresCampo['representanteLegal.apellidoPaterno']}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="rep_apellidoMaterno">Apellido Materno *</label>
              <input
                id="rep_apellidoMaterno"
                type="text"
                value={formData.representanteLegal?.apellidoMaterno || ''}
                onChange={(e) => handleChangeNested('representanteLegal', 'apellidoMaterno', e.target.value)}
                placeholder="Apellido materno"
                disabled={esRepresentanteYo} /* Deshabilitado SÓLO si el switch está encendido */
                className={erroresCampo['representanteLegal.apellidoMaterno'] ? 'campo-con-error' : ''}
              />
              {erroresCampo['representanteLegal.apellidoMaterno'] && <span className="error-text">{erroresCampo['representanteLegal.apellidoMaterno']}</span>}
            </div>
          </div>
        </div>

        <hr className="section-divider" />

        {/* ================= BLOQUE NOMBRE DEL SOLICITANTE ================= */}
        <div className="sub-section-block">
          <div className="section-header-inline">
            <h4 className="domicilio-title" style={{ margin: 0 }}>Nombre del Solicitante</h4>
            
            <div className={`switch-wrapper ${esPersonaMoral ? 'switch-disabled' : ''}`}>
              <span className="switch-label">Soy yo</span>
              <label className="switch-component">
                <input 
                  type="checkbox" 
                  checked={esSolicitanteYo} 
                  onChange={handleToggleSolicitante} 
                  disabled={esPersonaMoral} /* El switch SÍ se bloquea si es moral */
                />
                <span className="switch-slider"></span>
              </label>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="sol_nombre">Nombre *</label>
              <input
                id="sol_nombre"
                type="text"
                value={formData.solicitante?.nombre || ''}
                onChange={(e) => handleChangeNested('solicitante', 'nombre', e.target.value)}
                placeholder="Nombre(s)"
                disabled={esSolicitanteYo} /* Deshabilitado SÓLO si el switch está encendido */
                className={erroresCampo['solicitante.nombre'] ? 'campo-con-error' : ''}
              />
              {erroresCampo['solicitante.nombre'] && <span className="error-text">{erroresCampo['solicitante.nombre']}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="sol_apellidoPaterno">Apellido Paterno *</label>
              <input
                id="sol_apellidoPaterno"
                type="text"
                value={formData.solicitante?.apellidoPaterno || ''}
                onChange={(e) => handleChangeNested('solicitante', 'apellidoPaterno', e.target.value)}
                placeholder="Apellido paterno"
                disabled={esSolicitanteYo} /* Deshabilitado SÓLO si el switch está encendido */
                className={erroresCampo['solicitante.apellidoPaterno'] ? 'campo-con-error' : ''}
              />
              {erroresCampo['solicitante.apellidoPaterno'] && <span className="error-text">{erroresCampo['solicitante.apellidoPaterno']}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="sol_apellidoMaterno">Apellido Materno *</label>
              <input
                id="sol_apellidoMaterno"
                type="text"
                value={formData.solicitante?.apellidoMaterno || ''}
                onChange={(e) => handleChangeNested('solicitante', 'apellidoMaterno', e.target.value)}
                placeholder="Apellido materno"
                disabled={esSolicitanteYo} /* Deshabilitado SÓLO si el switch está encendido */
                className={erroresCampo['solicitante.apellidoMaterno'] ? 'campo-con-error' : ''}
              />
              {erroresCampo['solicitante.apellidoMaterno'] && <span className="error-text">{erroresCampo['solicitante.apellidoMaterno']}</span>}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};