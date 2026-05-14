import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCatalogos } from '../../../shared/hooks/useCatalogos';
import { VistaPreviaOficio } from '../../../features/modulo-correspondencia/oficio/components/VistaPreviaOficio';
import { guardarOficioContestacion } from '@/features/modulo-correspondencia/correspondencia/services/oficioContestacionService';
import '@/features/modulo-correspondencia/memorandum/styles/memorandum.css';

const FIRMANTE_FIJO = 5; // ana_admin

export const GenerarOficioContestacionPage = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const catalogos = useCatalogos();
  const heredado  = location.state || {};

  const [formData, setFormData] = useState({
    numOficioSalida: heredado.numOficioSalida || '',
  });
  const [instruccion, setInstruccion] = useState(heredado.textoSugerido || '');
  const [guardando, setGuardando]     = useState(false);
  const [error, setError]             = useState(null);
  const [errorNumOficio, setErrorNumOficio] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resolveIdUsuarioEmisor = () => {
    const usuario =
      heredado?.usuario ||
      heredado?.sessionUser ||
      heredado?.user ||
      null;

    const id =
      usuario?.id ??
      usuario?.idUsuario ??
      heredado?.idUsuarioEmisor ??
      heredado?.idUsuario ??
      null;

    if (id == null) return FIRMANTE_FIJO;
    const n = Number(id);
    return Number.isFinite(n) ? n : FIRMANTE_FIJO;
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!formData.numOficioSalida?.trim()) {
      setErrorNumOficio(true);
      document.getElementById('numOficioSalida')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setErrorNumOficio(false);
    if (!instruccion) { setError('El cuerpo del oficio es obligatorio.'); return; }
    setGuardando(true);
    try {
      const dto = {
        idCorrespondencia: Number(heredado.idCorrespondencia),
        idUsuarioEmisor: resolveIdUsuarioEmisor(),
        numOficioSalida: formData.numOficioSalida.trim(),
        asuntoContestacion: heredado?.asunto || null,
        cuerpoOficioTexto: instruccion || null,
        urlPdfFinal: null
      };
      await guardarOficioContestacion(dto);
      navigate('/correspondencia/registradas', {
        state: { refreshInterna: true, tabActivo: 'INTERNA' }
      });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Error al generar el oficio');
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

            <div className="form-group full-width" style={{ marginBottom: '1rem' }}>
              <label htmlFor="numOficioSalida">
                NO. OFICIO SALIDA <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                id="numOficioSalida"
                type="text"
                name="numOficioSalida"
                value={formData.numOficioSalida || ''}
                onChange={handleChange}
                placeholder="Ej: OFICIO/001/2026"
                required
                className=""
                style={{ borderColor: errorNumOficio ? '#dc2626' : undefined }}
              />
              {errorNumOficio && (
                <span style={{ color: '#dc2626', fontSize: '0.78rem' }}>
                  El número de oficio es obligatorio
                </span>
              )}
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
            formData={{ folioUnico: formData.numOficioSalida, instruccionSeguimiento: instruccion }}
            usuarios={catalogos.usuarios}
            areaDestino={null}
          />
        </section>

      </div>
    </div>
  );
};
