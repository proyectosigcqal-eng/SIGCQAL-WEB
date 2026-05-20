import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';

import { obtenerCorrespondenciaPorId } from '@/features/modulo-correspondencia/correspondencia/services/correspondenciaService';
import { guardarOficioContestacion } from '@/features/modulo-correspondencia/correspondencia/services/oficioContestacionService';

import { useCatalogos } from '@/shared/hooks/useCatalogos';

import { VistaPreviaOficio } from '@/features/modulo-correspondencia/oficio/components/VistaPreviaOficio';

import '@/features/modulo-correspondencia/memorandum/styles/memorandum.css';

export const GenerarOficioExternoPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { idCorrespondencia } = useParams();

  const catalogos = useCatalogos();

  const getSessionUsername = () => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw)?.username : null;
    } catch {
      return null;
    }
  };

  const [idUsuarioEmisor, setIdUsuarioEmisor] = useState(null);

  const heredado = location.state || {};

  const fuente =
    heredado.oficio ||
    heredado.memorandum ||
    heredado.oficioOriginal ||
    heredado.memoOriginal ||
    heredado.memorandumOriginal ||
    heredado.correspondencia ||
    heredado;

  const idCorrespondenciaH =
    idCorrespondencia ??
    fuente?.idCorrespondencia ??
    heredado.idCorrespondencia ??
    fuente?.id ??
    null;

  const firmanteH =
    fuente?.firmante ||
    fuente?.nombreFirmante ||
    heredado.firmante ||
    'ana_admin';

  const textoSugeridoH =
    heredado.textoSugerido ||
    fuente?.textoSugerido ||
    fuente?.respuestaSeguimiento ||
    '';

  const folioHeredado =
    heredado.folioOficio ||
    fuente?.folioOficio ||
    fuente?.folioUnico ||
    '';

  const asuntoBase = useMemo(() => fuente?.asunto || '', [fuente?.asunto]);

  const [formData, setFormData] = useState({
    numOficioSalida: heredado.numOficioSalida || '',
    idUsuarioEmisor: '',
    asuntoContestacion: asuntoBase || '',
  });

  const [instruccion, setInstruccion] = useState(textoSugeridoH);

  const [folioOficio, setFolioOficio] = useState(folioHeredado);

  const [guardando, setGuardando] = useState(false);

  const [error, setError] = useState(null);

  const [errorNumOficio, setErrorNumOficio] = useState(false);

  const [correspondencia, setCorrespondencia] = useState(null);

  useEffect(() => {
    const usuarios = catalogos?.usuarios;
    if (!usuarios?.length) return;
    const username = getSessionUsername();
    if (!username) return;
    const found = usuarios.find((u) => u.usuarioLogin === username);
    if (found) {
      setIdUsuarioEmisor(found.id);
      setFormData((prev) =>
        prev.idUsuarioEmisor === found.id ? prev : { ...prev, idUsuarioEmisor: found.id }
      );
    } else {
      console.warn('[GenerarOficioExterno] Usuario no encontrado en catálogo:', username);
      const fallback = usuarios[0]?.id ?? null;
      setIdUsuarioEmisor(fallback);
      setFormData((prev) =>
        prev.idUsuarioEmisor === fallback ? prev : { ...prev, idUsuarioEmisor: fallback }
      );
    }
  }, [catalogos?.usuarios]);

  useEffect(() => {
    if (!idCorrespondenciaH) return;

    obtenerCorrespondenciaPorId(idCorrespondenciaH)
      .then((data) => setCorrespondencia(data))
      .catch((err) => console.error('Error al cargar correspondencia:', err));
  }, [idCorrespondenciaH]);

  useEffect(() => {
    if (!correspondencia) return;
    if (formData.asuntoContestacion?.trim()) return;

    const asunto =
      asuntoBase ||
      correspondencia?.asunto ||
      '';

    setFormData((prev) => ({
      ...prev,
      asuntoContestacion: asunto,
    }));
  }, [asuntoBase, correspondencia, formData.asuntoContestacion]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGuardar = async (e) => {
    e.preventDefault();

    if (!idUsuarioEmisor) {
      alert('No se pudo identificar el usuario emisor. Vuelva a iniciar sesión.');
      return;
    }

    if (!formData.numOficioSalida?.trim()) {
      setErrorNumOficio(true);

      document
        .getElementById('numOficioSalida')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });

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
        idCorrespondencia: Number(idCorrespondenciaH),
        idUsuarioEmisor: idUsuarioEmisor,
        numOficioSalida: formData.numOficioSalida.trim(),
        asuntoContestacion:
          formData.asuntoContestacion ||
          fuente?.asunto ||
          correspondencia?.asunto ||
          null,
        cuerpoOficioTexto: instruccion,
        urlPdfFinal: null,
      };

      await guardarOficioContestacion(dto);

      navigate('/correspondencia/registradas', {
        state: { refreshExterna: true, tabActivo: 'EXTERNA' },
      });
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        'Error al guardar el oficio';
      setError(msg);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="sigcqal-page-container">
      <div className="split-view-container">
        <section className="panel-formulario">
          <h3
            style={{
              marginBottom: '1rem',
              color: '#691C32',
            }}
          >
            Oficio de Contestación Externa
          </h3>

          <p
            style={{
              color: '#718096',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
            }}
          >
            El firmante y los datos de referencia se heredan automáticamente.
          </p>

          {(fuente?.asunto || correspondencia) && (
            <div
              style={{
                background: '#f0f4f8',
                borderRadius: 8,
                padding: '12px 16px',
                marginBottom: '1.5rem',
                borderLeft: '3px solid #691C32',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: '0.85rem',
                  color: '#4a5568',
                }}
              >
                <strong>Asunto:</strong>{' '}
                {fuente?.asunto || correspondencia?.asunto}
              </p>

              <p
                style={{
                  margin: '4px 0 0',
                  fontSize: '0.85rem',
                  color: '#4a5568',
                }}
              >
                <strong>Remitente:</strong>{' '}
                {fuente?.dependenciaRemitente ||
                  correspondencia?.dependenciaRemitente}
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
                style={{
                  borderColor: errorNumOficio ? '#dc2626' : undefined,
                }}
              />

              {errorNumOficio && (
                <span
                  style={{
                    color: '#dc2626',
                    fontSize: '0.78rem',
                  }}
                >
                  El número de oficio es obligatorio
                </span>
              )}
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
              {guardando ? 'Guardando...' : '💾 Guardar Oficio'}
            </button>
          </form>
        </section>

        <section className="panel-vista-previa">
          <VistaPreviaOficio
            formData={{
              ...formData,
              instruccionSeguimiento: instruccion,
              asuntoCorrespondencia:
                formData.asuntoContestacion ||
                fuente?.asunto ||
                correspondencia?.asunto ||
                '',
              folioUnico: folioOficio || '',
            }}
            usuarios={catalogos.usuarios}
            areaDestino={{
              nombre:
                fuente?.dependenciaRemitente ||
                correspondencia?.dependenciaRemitente ||
                '',
            }}
          />
        </section>
      </div>
    </div>
  );
};
