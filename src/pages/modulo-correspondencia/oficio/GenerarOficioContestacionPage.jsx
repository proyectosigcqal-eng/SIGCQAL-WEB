import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { generarOficio } from '../../../features/modulo-correspondencia/oficio/services/oficioService';
import { useCatalogos } from '../../../shared/hooks/useCatalogos';
import { VistaPreviaOficio } from '../../../features/modulo-correspondencia/oficio/components/VistaPreviaOficio';
import '@/features/modulo-correspondencia/memorandum/styles/memorandum.css';

const FIRMANTE_FIJO = 5; // ana_admin

export const GenerarOficioContestacionPage = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const catalogos = useCatalogos();
  const heredado  = location.state || {};

  const [instruccion, setInstruccion] = useState(heredado.textoSugerido || '');
  const [guardando, setGuardando]     = useState(false);
  const [error, setError]             = useState(null);

  const formData = {
    idCorrespondencia: heredado.idCorrespondencia,
    idUsuarioFirmante: FIRMANTE_FIJO,
    idUsuarioEmisor:   FIRMANTE_FIJO,
    instruccionSeguimiento: instruccion,
    observaciones:     instruccion,
    idPlantilla:       2, // plantilla_oficio
    idArea:            null, // sin asignación de área
    folioUnico:        '',
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!instruccion) { setError('El cuerpo del oficio es obligatorio.'); return; }
    setGuardando(true);
    try {
      const payload = {
        ...formData,
        instruccionSeguimiento: instruccion,
        observaciones:          instruccion,
        nombreFirmante:         heredado.firmante    || 'ana_admin',
        areaFirmante:           heredado.areaFirmante || 'Administración',
        areaDestinatario:       '',
        nombreEmisor:           heredado.firmante    || 'ana_admin',
      };
      await generarOficio(payload);
      navigate('/correspondencia/bandeja');
    } catch (err) {
      setError('Error al generar el oficio: ' + err.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="sigcqal-page-container">
      <div className="split-view-container">

        {/* IZQUIERDA — formulario simplificado */}
        <section className="panel-formulario">
          <h3 style={{ marginBottom: '1rem', color: '#691C32' }}>
            Oficio de Contestación Interna
          </h3>
          <p style={{ color: '#718096', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            El firmante y los datos de referencia se heredan automáticamente.
          </p>

          {error && <div className="alert-danger">{error}</div>}

          <form onSubmit={handleGuardar}>
            {/* Firmante fijo — solo lectura */}
            <div className="form-group full-width" style={{ marginBottom: '1rem' }}>
              <label>Firmante</label>
              <input
                type="text"
                value={heredado.firmante || 'ana_admin'}
                disabled
                className="input-readonly"
              />
            </div>

            {/* Cuerpo del oficio */}
            <div className="form-group full-width rich-text-area" style={{ marginBottom: '1.5rem' }}>
              <div className="toolbar-mockup">
                <span className="tool-btn">B</span>
                <span className="tool-btn">I</span>
                <span className="tool-btn">U</span>
              </div>
              <textarea
                className="cuerpo-documento"
                rows={10}
                value={instruccion}
                onChange={(e) => setInstruccion(e.target.value)}
                placeholder="Cuerpo del oficio de contestación..."
              />
            </div>

            <button type="submit" className="btn-primario" disabled={guardando}>
              {guardando ? 'Generando...' : '📄 Generar Oficio'}
            </button>
          </form>
        </section>

        {/* DERECHA — vista previa */}
        <section className="panel-vista-previa">
          <VistaPreviaOficio
            formData={{ ...formData, instruccionSeguimiento: instruccion }}
            usuarios={catalogos.usuarios}
            areaDestino={null}
          />
        </section>

      </div>
    </div>
  );
};