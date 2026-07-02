import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { generarOficio, finalizarAsignacion } from '../../../features/modulo-correspondencia/oficio/services/oficioService';
import { obtenerCorrespondenciaPorId } from '../../../features/modulo-correspondencia/correspondencia/services/correspondenciaService';
import { useCatalogos } from '../../../shared/hooks/useCatalogos';
import { VistaPreviaOficio } from '../../../features/modulo-correspondencia/oficio/components/VistaPreviaOficio';
import '@/features/modulo-correspondencia/memorandum/styles/memorandum.css';



export const GenerarOficioContestacionPage = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const catalogos = useCatalogos();
  const heredado  = location.state || {};

  const fuente =
    heredado.oficio || heredado.memorandum || heredado.oficioOriginal ||
    heredado.memoOriginal || heredado.memorandumOriginal ||
    heredado.correspondencia || heredado;

  const idCorrespondenciaH =
    heredado.idCorrespondencia ?? fuente?.idCorrespondencia ?? fuente?.id ?? null;
// Agrega este cálculo ANTES del handleGuardar, usando los catálogos ya disponibles
  const token = localStorage.getItem('token');
  const payloadToken = JSON.parse(window.atob(token.split('.')[1]));
  const MI_ID_REAL = payloadToken.idUsuario
  const usuarioLogueado = catalogos.usuarios?.find(u => u.id === MI_ID_REAL || u.idUsuario === MI_ID_REAL);
  const areaFirmanteResuelta = usuarioLogueado?.nombreArea || usuarioLogueado?.area || 'Area no asignada';
  const nombreFirmanteResuelto = usuarioLogueado?.nombreUsuario || usuarioLogueado?.username || 'Usuario';
  const textoSugeridoH = heredado.textoSugerido || fuente?.textoSugerido || fuente?.respuestaSeguimiento || '';
  const folioHeredado  = heredado.folioOficio || fuente?.folioOficio || fuente?.folioUnico || '';

  const [formData, setFormData]     = useState({ numOficioSalida: heredado.numOficioSalida || '' });
  const [instruccion, setInstruccion] = useState(textoSugeridoH);
  const [folioOficio, setFolioOficio] = useState(folioHeredado);
  const [guardando, setGuardando]   = useState(false);
  const [error, setError]           = useState(null);
  const [errorNumOficio, setErrorNumOficio] = useState(false);
  const [correspondencia, setCorrespondencia] = useState(null);

  useEffect(() => {
    if (!idCorrespondenciaH) return;
    obtenerCorrespondenciaPorId(idCorrespondenciaH)
      .then(data => setCorrespondencia(data))
      .catch(err => console.error('Error al cargar correspondencia:', err));
  }, [idCorrespondenciaH]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async (e) => {
    e.preventDefault();

    if (!formData.numOficioSalida?.trim()) {
      setErrorNumOficio(true);
      document.getElementById('numOficioSalida')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setErrorNumOficio(false);

    if (!instruccion?.trim()) {
      setError('El cuerpo del oficio es obligatorio.');
      return;
    }

    setGuardando(true);
    setError(null);

    try {
      const payload = {
  idCorrespondencia:      heredado.idCorrespondencia,
  idUsuarioFirmante:      MI_ID_REAL,
  idUsuarioEmisor:        MI_ID_REAL,
  instruccionSeguimiento: instruccion,
  observaciones:          correspondencia?.asunto || instruccion,
  areaDestinatario:       correspondencia?.dependenciaRemitente || '',

  // ✅ Usar los datos resueltos desde catálogos, no hardcodeados
  nombreFirmante:         nombreFirmanteResuelto,
  areaFirmante:           areaFirmanteResuelta,
  nombreEmisor:           nombreFirmanteResuelto,

  idArea:                 null,   // ✅ null EXPLÍCITO — identifica que es contestación
  idPlantilla:            null,
  folioUnico:             formData.numOficioSalida || '', // ✅ usar el número de oficio capturado
  esContestacion:         true,   // ✅ añadir este campo si el backend lo soporta
};
      // 1) Crear registro del oficio en el backend y obtener su id
      const resultado = await generarOficio(payload);
      const nuevoId = resultado?.id;
      if (!nuevoId) throw new Error('No se obtuvo id del oficio generado');

      // 2) Generar PDF en cliente desde la vista previa (elemento con id 'oficio-pdf-content')
      const elemento = document.getElementById('oficio-pdf-content');
      if (!elemento) {
        console.warn('GenerarOficioContestacionPage: no se encontró #oficio-pdf-content para generar PDF');
        navigate('/correspondencia/registradas', { state: { refreshInterna: true, tabActivo: 'INTERNA' } });
        return;
      }

// ✅ Reemplaza toda la sección de generación del PDF
const canvas  = await html2canvas(elemento, {
  scale: 2,
  useCORS: true,
  logging: false,
  onclone: (clonedDoc) => {
    const el = clonedDoc.getElementById('oficio-pdf-content');
    if (!el) return;

    // ✅ Altura fija carta — evita que el contenido desborde
    el.style.width     = '816px';
    el.style.height    = '816px';
    el.style.minHeight = '816px';
    el.style.maxHeight = '816px';
    el.style.overflow  = 'hidden';
    el.style.position  = 'relative';
    el.style.boxSizing = 'border-box';

    const imgMembrete = el.querySelector('.membrete-fondo');
    if (imgMembrete) {
      imgMembrete.style.position  = 'absolute';
      imgMembrete.style.top       = '0';
      imgMembrete.style.left      = '0';
      imgMembrete.style.width     = '100%';
      imgMembrete.style.height    = '100%';
      imgMembrete.style.objectFit = 'fill';
      imgMembrete.style.zIndex    = '0';
    }

    const contenido = el.querySelector('.membrete-contenido');
    if (contenido) {
      contenido.style.position      = 'absolute';
      contenido.style.top           = '0';
      contenido.style.left          = '0';
      contenido.style.width         = '100%';
      contenido.style.height        = '100%';
      contenido.style.padding       = '200px 56px 80px 56px';
      contenido.style.boxSizing     = 'border-box';
      contenido.style.zIndex        = '1';
      contenido.style.display       = 'flex';
      contenido.style.flexDirection = 'column';
      contenido.style.fontSize      = '13px';
      contenido.style.lineHeight    = '1.5';
      contenido.style.overflow      = 'hidden'; // ← evita desborde
    }

    const firma = el.querySelector('.membrete-footer-firma');
    if (firma) {
      firma.style.marginTop = 'auto'; // ← empuja firma al fondo dentro del flex
      firma.style.textAlign = 'center';
    }

    const parrafos = el.getElementsByTagName('p');
    for (let p of parrafos) {
      p.style.margin    = '4px 0';
      p.style.wordBreak = 'normal';
    }
  }
});

const imgData = canvas.toDataURL('image/png');
const pdf     = new jsPDF('p', 'mm', 'letter');

// ✅ Fuerza una sola página — escala imagen al tamaño carta exacto
pdf.addImage(imgData, 'PNG', 0, 0, 215.9, 279.4);

const pdfBlob = pdf.output('blob');
const file    = new File(
  [pdfBlob],
  `OFICIO_${resultado?.folioUnico || nuevoId}.pdf`,
  { type: 'application/pdf' }
);

      // 3) Subir el PDF generado y asociarlo al oficio (usa el endpoint existente)
      await finalizarAsignacion(nuevoId, file, null);

      // 4) Navegar a la lista
      navigate('/correspondencia/registradas', {
        state: { refreshInterna: true, tabActivo: 'INTERNA' },
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

        <section className="panel-formulario">
          <h3 style={{ marginBottom: '1rem', color: '#691C32' }}>Oficio de Contestación Interna</h3>
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
              {/* ✅ Ahora muestra el nombre real del usuario logueado */}
              <input type="text" value={nombreFirmanteResuelto} disabled className="input-readonly" />
            </div>

            <div className="form-group full-width" style={{ marginBottom: '1rem' }}>
              <label htmlFor="numOficioSalida">
                NO. OFICIO SALIDA <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                id="numOficioSalida" type="text" name="numOficioSalida"
                value={formData.numOficioSalida} onChange={handleChange}
                placeholder="Ej: OFICIO/001/2026" required
                style={{ borderColor: errorNumOficio ? '#dc2626' : undefined }}
              />
              {errorNumOficio && <span style={{ color: '#dc2626', fontSize: '0.78rem' }}>El número de oficio es obligatorio</span>}
            </div>

            {/* Campo 'Folio (manual)' eliminado por requerimiento */}

            <div className="form-group full-width rich-text-area" style={{ marginBottom: '1.5rem' }}>
              <div className="toolbar-mockup">
                <span className="tool-btn">B</span>
                <span className="tool-btn">I</span>
                <span className="tool-btn">U</span>
              </div>
              <textarea className="cuerpo-documento" rows={10} value={instruccion}
                onChange={(e) => setInstruccion(e.target.value)}
                placeholder="Cuerpo del oficio de contestación..." />
            </div>

            <button type="submit" className="btn-primario" disabled={guardando}>
              {guardando ? 'Generando...' : '📄 Generar Oficio'}
            </button>
          </form>
        </section>

        <section className="panel-vista-previa">
         <VistaPreviaOficio
  formData={{
    folioUnico:             formData.numOficioSalida || folioOficio || '',
    asuntoCorrespondencia:  correspondencia?.asunto || '',
    observaciones:          correspondencia?.asunto || '',
    instruccionSeguimiento: instruccion,
    idUsuarioFirmante:      MI_ID_REAL,
    idUsuarioEmisor:        MI_ID_REAL,
    // ✅ Pasar los datos ya resueltos para que la vista previa sea idéntica al PDF guardado
    nombreFirmante:         nombreFirmanteResuelto,
    areaFirmante:           areaFirmanteResuelta,
  }}
            usuarios={catalogos.usuarios}
            areaDestino={{
              nombre:     correspondencia?.dependenciaRemitente || '',
              nombreArea: correspondencia?.dependenciaRemitente || '',
            }}
          />
        </section>

      </div>
    </div>
  );
};

export default GenerarOficioContestacionPage;