import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { generarOficio } from '../../../features/modulo-correspondencia/oficio/services/oficioService';
import { obtenerCorrespondenciaPorId } from '../../../features/modulo-correspondencia/correspondencia/services/correspondenciaService';
import { useCatalogos } from '../../../shared/hooks/useCatalogos';
import { VistaPreviaOficio } from '../../../features/modulo-correspondencia/oficio/components/VistaPreviaOficio';
import '@/features/modulo-correspondencia/memorandum/styles/memorandum.css';

const FIRMANTE_FIJO = 5; // ana_admin

export const GenerarOficioContestacionPage = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const catalogos = useCatalogos();
  const heredado  = location.state || {};

  const fuente =
    heredado.oficio || heredado.memorandum || heredado.oficioOriginal || heredado.memoOriginal || heredado.memorandumOriginal || heredado.correspondencia || heredado;

  const idCorrespondenciaH = fuente?.idCorrespondencia ?? heredado.idCorrespondencia ?? fuente?.id ?? null;
  const firmanteH = fuente?.firmante || fuente?.nombreFirmante || heredado.firmante || 'ana_admin';
  const areaFirmanteH = fuente?.areaFirmante || fuente?.area || heredado.areaFirmante || 'Administración';
  const textoSugeridoH = heredado.textoSugerido || fuente?.textoSugerido || fuente?.respuestaSeguimiento || '';
  const folioHeredado = heredado.folioOficio || fuente?.folioOficio || fuente?.folioUnico || '';

  const [instruccion, setInstruccion]       = useState(textoSugeridoH);
  const [guardando, setGuardando]           = useState(false);
  const [error, setError]                   = useState(null);
  const [folioOficio, setFolioOficio]       = useState(folioHeredado || '');
  const [correspondencia, setCorrespondencia] = useState(null);

  // ← Carga la correspondencia para heredar asunto y área remitente
  useEffect(() => {
    if (!idCorrespondenciaH) return;
    obtenerCorrespondenciaPorId(idCorrespondenciaH)
      .then(data => setCorrespondencia(data))
      .catch(err => console.error('Error al cargar correspondencia:', err));
  }, [idCorrespondenciaH]);

  const formData = {
    idCorrespondencia:      idCorrespondenciaH,
    idUsuarioFirmante:      FIRMANTE_FIJO,
    idUsuarioEmisor:        FIRMANTE_FIJO,
    instruccionSeguimiento: instruccion,
    observaciones:          instruccion,
    idPlantilla:            null,
    idArea:                 null,
    folioUnico:             '',
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!instruccion) { setError('El cuerpo del oficio es obligatorio.'); return; }
    setGuardando(true);
    try {
      const payload = {
        ...formData,
        instruccionSeguimiento: instruccion,
        // Preferir asunto del memorandum/oficio si viene en el state
        observaciones:    fuente?.asunto || correspondencia?.asunto || instruccion,
        nombreFirmante:   firmanteH,
        areaFirmante:     areaFirmanteH,
        // Área destinataria viene preferentemente del objeto original
        areaDestinatario: fuente?.dependenciaRemitente || correspondencia?.dependenciaRemitente || '',
        nombreEmisor:     firmanteH,
      };
      const resultado = await generarOficio(payload);
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

        <section className="panel-formulario">
          <h3 style={{ marginBottom: '1rem', color: '#691C32' }}>
            Oficio de Contestación Interna
          </h3>
          <p style={{ color: '#718096', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            El firmante y los datos de referencia se heredan automáticamente.
          </p>

          {(fuente?.asunto || correspondencia) && (
            <div style={{ background: '#f0f4f8', borderRadius: 8, padding: '12px 16px', marginBottom: '1.5rem', borderLeft: '3px solid #691C32' }}>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#4a5568' }}>
                <strong>Asunto:</strong> {fuente?.asunto || correspondencia?.asunto}
              </p>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#4a5568' }}>
                <strong>Remitente:</strong> {fuente?.dependenciaRemitente || correspondencia?.dependenciaRemitente}
              </p>
            </div>
          )}

          {error && <div className="alert-danger">{error}</div>}

          <form onSubmit={handleGuardar}>
            <div className="form-group full-width" style={{ marginBottom: '1rem' }}>
              <label>Firmante</label>
              <input
                type="text"
                value={firmanteH}
                disabled
                className="input-readonly"
              />
            </div>

            <div className="form-group full-width" style={{ marginBottom: '1rem' }}>
              <label>Folio (manual)</label>
              <input
                type="text"
                className="form-control"
                value={folioOficio}
                onChange={(e) => setFolioOficio(e.target.value)}
                placeholder="Introduce folio para el oficio (opcional)"
              />
            </div>

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

        <section className="panel-vista-previa">
          <VistaPreviaOficio
            formData={{
              ...formData,
              instruccionSeguimiento: instruccion,
              asuntoCorrespondencia:  fuente?.asunto || correspondencia?.asunto || '',
              folioUnico:             folioOficio || '',
            }}
            usuarios={catalogos.usuarios}
            areaDestino={{ nombre: fuente?.dependenciaRemitente || correspondencia?.dependenciaRemitente || '' }}
          />
        </section>

      </div>
    </div>
  );
};