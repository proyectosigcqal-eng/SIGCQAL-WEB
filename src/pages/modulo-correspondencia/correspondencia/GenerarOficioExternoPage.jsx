import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { obtenerCorrespondenciaPorId } from '@/features/modulo-correspondencia/correspondencia/services/correspondenciaService';
import { finalizarOficioContestacionPdf, guardarOficioContestacion } from '@/features/modulo-correspondencia/correspondencia/services/oficioContestacionService';
import { useCatalogos } from '@/shared/hooks/useCatalogos';
import { VistaPreviaOficio } from '@/features/modulo-correspondencia/oficio/components/VistaPreviaOficio';
import { useAuth } from '@/shared/context/AuthContext';
import '@/features/modulo-correspondencia/memorandum/styles/memorandum.css';

export const GenerarOficioExternoPage = () => {
  const location              = useLocation();
  const navigate              = useNavigate();
  const { idCorrespondencia } = useParams();
  const catalogos             = useCatalogos();
  const { session }           = useAuth();

  // ── Usuario activo desde sesión ──────────────────────────────────────────
  const idUsuarioSesion  = session?.idUsuario ?? session?.id ?? session?.usuarioId ?? null;
  const nombreSesion     = session?.username  ?? session?.nombre ?? null;

  const [idUsuarioEmisor, setIdUsuarioEmisor] = useState(null);

  const heredado = location.state || {};

  const fuente =
    heredado.oficio || heredado.memorandum || heredado.oficioOriginal ||
    heredado.memoOriginal || heredado.memorandumOriginal ||
    heredado.correspondencia || heredado;

  const idCorrespondenciaH =
    idCorrespondencia ?? fuente?.idCorrespondencia ?? heredado.idCorrespondencia ?? fuente?.id ?? null;

  const firmanteH = fuente?.firmante || fuente?.nombreFirmante || heredado.firmante || nombreSesion || '';

  const textoSugeridoH = heredado.textoSugerido || fuente?.textoSugerido || fuente?.respuestaSeguimiento || '';
  const folioHeredado  = heredado.folioOficio    || fuente?.folioOficio   || fuente?.folioUnico || '';
  const asuntoBase     = useMemo(() => fuente?.asunto || '', [fuente?.asunto]);

  const [formData, setFormData] = useState({
    numOficioSalida:    heredado.numOficioSalida || '',
    idUsuarioEmisor:    '',
    asuntoContestacion: asuntoBase || '',
  });

  const [instruccion,     setInstruccion]     = useState(textoSugeridoH);
  const [folioOficio,     setFolioOficio]      = useState(folioHeredado);
  const [guardando,       setGuardando]        = useState(false);
  const [error,           setError]            = useState(null);
  const [errorNumOficio,  setErrorNumOficio]   = useState(false);
  const [correspondencia, setCorrespondencia]  = useState(null);
  const [archivoPdfFinal, setArchivoPdfFinal]  = useState(null);
  const [errorArchivo,    setErrorArchivo]     = useState(null);

  // Resuelve idUsuarioEmisor: busca el usuario en catálogos por id de sesión,
  // así el nombre que se muestra en la vista previa coincide con el registro.
  useEffect(() => {
    const usuarios = catalogos?.usuarios;
    if (!usuarios?.length || !idUsuarioSesion) return;

    const found = usuarios.find(u => u.id === idUsuarioSesion || u.idUsuario === idUsuarioSesion);
    if (found) {
      setIdUsuarioEmisor(found.id);
      setFormData(prev => prev.idUsuarioEmisor === found.id ? prev : { ...prev, idUsuarioEmisor: found.id });
    } else {
      // El usuario de sesión no está en el catálogo — puede ser un rol sin área asignada
      console.warn('[GenerarOficioExterno] Usuario de sesión no encontrado en catálogo:', idUsuarioSesion);
      setIdUsuarioEmisor(idUsuarioSesion);
      setFormData(prev => ({ ...prev, idUsuarioEmisor: idUsuarioSesion }));
    }
  }, [catalogos?.usuarios, idUsuarioSesion]);

  useEffect(() => {
    if (!idCorrespondenciaH) return;
    obtenerCorrespondenciaPorId(idCorrespondenciaH)
      .then(data => setCorrespondencia(data))
      .catch(err => console.error('Error al cargar correspondencia:', err));
  }, [idCorrespondenciaH]);

  useEffect(() => {
    if (!correspondencia) return;
    if (formData.asuntoContestacion?.trim()) return;
    setFormData(prev => ({ ...prev, asuntoContestacion: asuntoBase || correspondencia?.asunto || '' }));
  }, [asuntoBase, correspondencia, formData.asuntoContestacion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setErrorArchivo(null);

    if (!idUsuarioEmisor) {
      setError('No se pudo identificar el usuario emisor. Por favor inicia sesión nuevamente.');
      return;
    }

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
      const dto = {
        idCorrespondencia:  Number(idCorrespondenciaH),
        idUsuarioEmisor:    idUsuarioEmisor,
        numOficioSalida:    formData.numOficioSalida.trim(),
        asuntoContestacion: formData.asuntoContestacion || fuente?.asunto || correspondencia?.asunto || null,
        cuerpoOficioTexto:  instruccion,
        urlPdfFinal:        null,
      };

      await guardarOficioContestacion(dto);
      if (archivoPdfFinal) {
        await finalizarOficioContestacionPdf(Number(idCorrespondenciaH), archivoPdfFinal);
      }

      navigate('/correspondencia/registradas', {
        state: { refreshExterna: true, tabActivo: 'EXTERNA' },
      });
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.response?.data?.message || err?.message || 'Error al guardar el oficio';
      setError(msg);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="sigcqal-page-container">
      <div className="split-view-container">
        <section className="panel-formulario">
          <h3 style={{ marginBottom: '1rem', color: '#691C32' }}>Oficio de Contestación Externa</h3>
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
              <label htmlFor="asuntoContestacion">Asunto de contestación</label>
              <input
                id="asuntoContestacion"
                type="text"
                name="asuntoContestacion"
                value={formData.asuntoContestacion}
                onChange={handleChange}
                placeholder="Asunto del oficio de contestación..."
              />
            </div>

            <div className="form-group full-width" style={{ marginBottom: '1rem' }}>
              <label>Firmante</label>
              <input type="text" value={firmanteH} disabled className="input-readonly" />
            </div>

            <div className="form-group full-width" style={{ marginBottom: '1rem' }}>
              <label htmlFor="numOficioSalida">
                NO. OFICIO SALIDA <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                id="numOficioSalida"
                type="text"
                name="numOficioSalida"
                value={formData.numOficioSalida}
                onChange={handleChange}
                placeholder="Ej: OFICIO/001/2026"
                required
                style={{ borderColor: errorNumOficio ? '#dc2626' : undefined }}
              />
              {errorNumOficio && (
                <span style={{ color: '#dc2626', fontSize: '0.78rem' }}>
                  El número de oficio es obligatorio
                </span>
              )}
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

            <div className="form-group full-width" style={{ marginBottom: '1.5rem' }}>
              <label>PDF final firmado (opcional)</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  const file = e?.target?.files?.[0] || null;
                  if (!file) { setArchivoPdfFinal(null); setErrorArchivo(null); return; }
                  if (file.type && file.type !== 'application/pdf') {
                    setArchivoPdfFinal(null);
                    setErrorArchivo('Formato no permitido. Solo PDF.');
                    return;
                  }
                  if (file.size > 10 * 1024 * 1024) {
                    setArchivoPdfFinal(null);
                    setErrorArchivo('El archivo excede el tamaño máximo de 10 MB.');
                    return;
                  }
                  setArchivoPdfFinal(file);
                  setErrorArchivo(null);
                }}
              />
              {archivoPdfFinal && <div style={{ marginTop: 6, color: '#334155', fontSize: '0.85rem' }}>{archivoPdfFinal.name}</div>}
              {errorArchivo    && <div style={{ marginTop: 6, color: '#dc2626', fontSize: '0.85rem' }}>{errorArchivo}</div>}
            </div>

            <button type="submit" className="btn-primario" disabled={guardando}>
              {guardando ? 'Guardando...' : '💾 Guardar Oficio'}
            </button>
          </form>
        </section>

        <section className="panel-vista-previa">
          <VistaPreviaOficio
            formData={{
              ...formData,
              instruccionSeguimiento: instruccion,
              asuntoCorrespondencia:  formData.asuntoContestacion || fuente?.asunto || correspondencia?.asunto || '',
              folioUnico:             folioOficio || '',
            }}
            usuarios={catalogos.usuarios}
            areaDestino={{
              nombre: fuente?.dependenciaRemitente || correspondencia?.dependenciaRemitente || '',
            }}
          />
        </section>
      </div>
    </div>
  );
};