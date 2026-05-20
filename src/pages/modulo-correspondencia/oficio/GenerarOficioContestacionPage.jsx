import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { generarOficio } from '../../../features/modulo-correspondencia/oficio/services/oficioService';
import { obtenerCorrespondenciaPorId } from '../../../features/modulo-correspondencia/correspondencia/services/correspondenciaService';

import { useCatalogos } from '../../../shared/hooks/useCatalogos';

import { VistaPreviaOficio } from '../../../features/modulo-correspondencia/oficio/components/VistaPreviaOficio';

import { guardarOficioContestacion } from '@/features/modulo-correspondencia/correspondencia/services/oficioContestacionService';

import '@/features/modulo-correspondencia/memorandum/styles/memorandum.css';

const FIRMANTE_FIJO = 10; // ana_admin

export const GenerarOficioContestacionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const catalogos = useCatalogos();

  const heredado = location.state || {};

  // =========================
  // DATOS HEREDADOS
  // =========================
  const fuente =
    heredado.oficio ||
    heredado.memorandum ||
    heredado.oficioOriginal ||
    heredado.memoOriginal ||
    heredado.memorandumOriginal ||
    heredado.correspondencia ||
    heredado;

  // Prioriza el idCorrespondencia pasado en location.state (heredado)
  const idCorrespondenciaH =
    heredado.idCorrespondencia ??
    fuente?.idCorrespondencia ??
    fuente?.id ??
    null;

  const firmanteH =
    fuente?.firmante ||
    fuente?.nombreFirmante ||
    heredado.firmante ||
    'ana_admin';

  const areaFirmanteH =
    fuente?.areaFirmante ||
    fuente?.area ||
    heredado.areaFirmante ||
    'Administración';

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

  // =========================
  // STATES
  // =========================
  const [formData, setFormData] = useState({
    numOficioSalida: heredado.numOficioSalida || '',
  });

  const [instruccion, setInstruccion] = useState(textoSugeridoH);

  const [folioOficio, setFolioOficio] = useState(folioHeredado);

  const [guardando, setGuardando] = useState(false);

  const [error, setError] = useState(null);

  const [errorNumOficio, setErrorNumOficio] = useState(false);

  const [correspondencia, setCorrespondencia] = useState(null);

  // Diagnostic logs para depuración en runtime
  useEffect(() => {
    console.log('=== DIAGNÓSTICO OFICIO CONTESTACIÓN (MOUNT/UPDATE) ===');
    console.log('location.state:', location.state);
    console.log('heredado.idCorrespondencia:', heredado.idCorrespondencia);
    console.log('fuente:', fuente);
    console.log('correspondencia cargada:', correspondencia);
  }, [correspondencia]);

  // =========================
  // CARGAR CORRESPONDENCIA
  // =========================
  useEffect(() => {
    if (!idCorrespondenciaH) return;

    obtenerCorrespondenciaPorId(idCorrespondenciaH)
      .then((data) => setCorrespondencia(data))
      .catch((err) => console.error('Error al cargar correspondencia:', err));
  }, [idCorrespondenciaH]);

  // =========================
  // HANDLE INPUTS
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // RESOLVER EMISOR
  // =========================
  const resolveIdUsuarioEmisor = () => {
    const usuario = heredado?.usuario || heredado?.sessionUser || heredado?.user || null;

    const id =
      usuario?.id ?? usuario?.idUsuario ?? heredado?.idUsuarioEmisor ?? heredado?.idUsuario ?? null;

    if (id == null) return FIRMANTE_FIJO;

    const n = Number(id);
    return Number.isFinite(n) ? n : FIRMANTE_FIJO;
  };

  // =========================
  // GUARDAR
  // =========================
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
      // Construir payload usando valores heredados en `location.state` cuando existan
      const payload = {
        idCorrespondencia:      heredado.idCorrespondencia ?? idCorrespondenciaH,
        idUsuarioFirmante:      heredado.idUsuarioFirmante ?? FIRMANTE_FIJO,
        idUsuarioEmisor:        heredado.idUsuarioEmisor ?? resolveIdUsuarioEmisor(),
        instruccionSeguimiento: instruccion,
        observaciones:          correspondencia?.asunto || fuente?.asunto || instruccion,
        areaDestinatario:       correspondencia?.dependenciaRemitente || fuente?.dependenciaRemitente || '',
        idPlantilla:            null,
        idArea:                 null,
        folioUnico:             folioOficio || '',
        nombreFirmante:         heredado.firmante || firmanteH,
        areaFirmante:           heredado.areaFirmante || areaFirmanteH,
        nombreEmisor:           heredado.nombreEmisor || heredado.firmante || firmanteH,
      };

      console.log('=== DIAGNÓSTICO OFICIO CONTESTACIÓN ===');
      console.log('location.state:', location.state);
      console.log('heredado.idCorrespondencia:', heredado.idCorrespondencia);
      console.log('fuente:', fuente);
      console.log('correspondencia cargada:', correspondencia);
      console.log('payload que se enviará:', payload);

      await generarOficio(payload);

      navigate('/correspondencia/registradas', {
        state: { refreshInterna: true, tabActivo: 'INTERNA' },
      });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Error al generar el oficio');
    } finally {
      setGuardando(false);
    }
  };

  // =========================
  // RENDER
  // =========================
  return (
    <div className="sigcqal-page-container">
      <div className="split-view-container">

        {/* ========================= */}
        {/* FORMULARIO */}
        {/* ========================= */}
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
                <strong>Asunto:</strong>{' '}
                {fuente?.asunto || correspondencia?.asunto}
              </p>

              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#4a5568' }}>
                <strong>Remitente:</strong>{' '}
                {fuente?.dependenciaRemitente || correspondencia?.dependenciaRemitente}
              </p>
            </div>
          )}

          {error && <div className="alert-danger">{error}</div>}

          <form onSubmit={handleGuardar}>

            {/* FIRMANTE */}
            <div className="form-group full-width" style={{ marginBottom: '1rem' }}>
              <label>Firmante</label>

              <input type="text" value={firmanteH} disabled className="input-readonly" />
            </div>

            {/* NUMERO OFICIO */}
            <div className="form-group full-width" style={{ marginBottom: '1rem' }}>
              <label htmlFor="numOficioSalida">
                NO. OFICIO SALIDA{' '}
                <span style={{ color: '#dc2626' }}>*</span>
              </label>

              <input id="numOficioSalida" type="text" name="numOficioSalida" value={formData.numOficioSalida} onChange={handleChange} placeholder="Ej: OFICIO/001/2026" required style={{ borderColor: errorNumOficio ? '#dc2626' : undefined }} />

              {errorNumOficio && (
                <span style={{ color: '#dc2626', fontSize: '0.78rem' }}>El número de oficio es obligatorio</span>
              )}
            </div>

            {/* FOLIO */}
            <div className="form-group full-width" style={{ marginBottom: '1rem' }}>
              <label>Folio (manual)</label>

              <input type="text" className="form-control" value={folioOficio} onChange={(e) => setFolioOficio(e.target.value)} placeholder="Introduce folio para el oficio (opcional)" />
            </div>

            {/* CUERPO */}
            <div className="form-group full-width rich-text-area" style={{ marginBottom: '1.5rem' }}>
              <div className="toolbar-mockup">
                <span className="tool-btn">B</span>
                <span className="tool-btn">I</span>
                <span className="tool-btn">U</span>
              </div>

              <textarea className="cuerpo-documento" rows={10} value={instruccion} onChange={(e) => setInstruccion(e.target.value)} placeholder="Cuerpo del oficio de contestación..." />
            </div>

            {/* BOTON */}
            <button type="submit" className="btn-primario" disabled={guardando}>{guardando ? 'Generando...' : '📄 Generar Oficio'}</button>

          </form>
        </section>

        {/* VISTA PREVIA */}
        <section className="panel-vista-previa">
          <VistaPreviaOficio
            formData={{
              ...formData,
              instruccionSeguimiento: instruccion,
              asuntoCorrespondencia: fuente?.asunto || correspondencia?.asunto || '',
              folioUnico: folioOficio || '',
              idUsuarioFirmante: heredado.idUsuarioFirmante || FIRMANTE_FIJO,
              idUsuarioEmisor: heredado.idUsuarioEmisor || resolveIdUsuarioEmisor(),
              observaciones: correspondencia?.asunto || fuente?.asunto || '',
            }}
            usuarios={catalogos.usuarios}
            areaDestino={{ nombre: fuente?.dependenciaRemitente || correspondencia?.dependenciaRemitente || '' }}
          />
        </section>

      </div>
    </div>
  );
};

export default GenerarOficioContestacionPage;