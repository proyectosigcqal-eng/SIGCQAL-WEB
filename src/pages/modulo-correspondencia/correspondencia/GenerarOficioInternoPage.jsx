import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { obtenerCorrespondenciaPorId } from '../../../features/modulo-correspondencia/correspondencia/services/correspondenciaService';
import { FormularioOficio } from '@/features/modulo-correspondencia/oficio/components/FormularioOficio';
import { VistaPreviaOficio } from '@/features/modulo-correspondencia/oficio/components/VistaPreviaOficio';
import {
  finalizarOficioContestacionPdf,
  guardarOficioContestacion
} from '../../../features/modulo-correspondencia/correspondencia/services/oficioContestacionService';
import { useOficio } from '@/features/modulo-correspondencia/oficio/hooks/useOficio';
import { useCatalogos } from '../../../shared/hooks/useCatalogos';
import '@/features/modulo-correspondencia/oficio/styles/oficio.css';
import '@/features/modulo-correspondencia/correspondencia/styles/correspondencia.css';

export const GenerarOficioInternoPage = () => {
  const { idCorrespondencia } = useParams();
  const navigate = useNavigate();
  const [correspondencia, setCorrespondencia] = useState(null);
  const [loadingCorr, setLoadingCorr] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState(null);
  const [errorNumOficio, setErrorNumOficio] = useState(false);
  const [archivoPdfFinal, setArchivoPdfFinal] = useState(null);
  const [errorArchivo, setErrorArchivo] = useState(null);
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

  useEffect(() => {
    if (!idCorrespondencia) {
      setLoadingCorr(false);
      return;
    }
    obtenerCorrespondenciaPorId(idCorrespondencia)
      .then((data) => {
        console.log('[DEBUG] Correspondencia cargada:', data);
        console.log('[DEBUG] Keys disponibles:', Object.keys(data || {}));
        setCorrespondencia(data);
      })
      .catch((err) => console.error('Error al cargar correspondencia:', err))
      .finally(() => setLoadingCorr(false));
  }, [idCorrespondencia]);

  const { formData, setFormData, handleChange } = useOficio(correspondencia, catalogos);

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
      console.warn('[GenerarOficioInterno] Usuario no encontrado en catálogo:', username);
      const fallback = usuarios[0]?.id ?? null;
      setIdUsuarioEmisor(fallback);
      setFormData((prev) =>
        prev.idUsuarioEmisor === fallback ? prev : { ...prev, idUsuarioEmisor: fallback }
      );
    }
  }, [catalogos?.usuarios]);

  const handleSubmitInterno = async (e) => {
    e.preventDefault();
    setErrorGuardar(null);
    setErrorArchivo(null);
    if (!formData.folioUnico?.trim()) {
      setErrorNumOficio(true);
      document.getElementById('numOficioSalida')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setErrorNumOficio(false);
    if (!idUsuarioEmisor) {
      setErrorGuardar(
        'No se pudo identificar el usuario logueado. Por favor, cierre sesión y vuelva a ingresar.'
      );
      return;
    }
    if (!formData.asuntoCorrespondencia?.trim()) {
      setErrorGuardar('El asunto es obligatorio');
      return;
    }
    if (!formData.instruccionSeguimiento?.trim()) {
      setErrorGuardar('El cuerpo del oficio es obligatorio');
      return;
    }
    setGuardando(true);
    try {
      const dto = {
        idCorrespondencia: Number(idCorrespondencia),
        idUsuarioEmisor: idUsuarioEmisor,
        numOficioSalida: formData.folioUnico.trim(),
        asuntoContestacion: formData.asuntoCorrespondencia || null,
        cuerpoOficioTexto: formData.instruccionSeguimiento || null,
        urlPdfFinal: null
      };
      await guardarOficioContestacion(dto);
      if (archivoPdfFinal) {
        await finalizarOficioContestacionPdf(Number(idCorrespondencia), archivoPdfFinal);
      }
      navigate('/correspondencia/registradas', {
        state: { refreshInterna: true, tabActivo: 'INTERNA' }
      });
    } catch (err) {
      setErrorGuardar(err?.response?.data?.message || err?.message || 'Error al guardar el oficio');
    } finally {
      setGuardando(false);
    }
  };

  if (loadingCorr) {
    return <div style={{ padding: '2rem' }}>Cargando correspondencia...</div>;
  }

  return (
    <div className="sigcqal-page-container">
      <div className="page-header-corr">
        <button type="button" className="btn-secundario-corr" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <h1 className="page-title-corr">Generar Oficio de Contestación</h1>
        <div style={{ width: 120 }} />
      </div>

      {errorGuardar && (
        <div className="alerta-error" style={{ margin: '0 1.5rem 1rem' }}>
          {errorGuardar}
        </div>
      )}

      {correspondencia && (
        <div
          style={{
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: 6,
            padding: '0.75rem 1.5rem',
            margin: '0 1.5rem 1rem',
            fontSize: '0.875rem',
            color: '#1e40af'
          }}
        >
          <div style={{ marginBottom: '0.25rem' }}>
            <strong>Folio:</strong>{' '}
            {correspondencia.folioUnico ??
              correspondencia.folio_unico ??
              correspondencia.folio ??
              '—'}
          </div>
          <div style={{ marginBottom: '0.25rem' }}>
            <strong>Asunto:</strong> {correspondencia.asunto ?? '—'}
          </div>
          <div style={{ marginBottom: '0.25rem' }}>
            <strong>Dependencia remitente:</strong>{' '}
            {correspondencia.dependenciaRemitente ??
              correspondencia.dependencia_remitente ??
              correspondencia.dependencia ??
              '—'}
          </div>
          <div>
            <strong>Titular / Encargado:</strong>{' '}
            {correspondencia.titularDependencia ??
              correspondencia.titular_dependencia ??
              correspondencia.nombreRemitente ??
              correspondencia.nombre_remitente ??
              correspondencia.encargado ??
              '—'}
          </div>
        </div>
      )}

      <div className="split-view-container">
        <section className="panel-formulario">
          <FormularioOficio
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            handleSubmit={handleSubmitInterno}
            catalogos={catalogos}
            submitLabel={guardando ? 'Guardando...' : 'Guardar Oficio'}
            submitDisabled={guardando}
            showEmisorFirmantePlantilla={false}
            folioLabel="No. Oficio Salida"
            folioEditable
            folioRequired
            folioError={errorNumOficio}
            folioPlaceholder="Ej: OFICIO/001/2026"
            folioInputId="numOficioSalida"
          >
            <div className="form-group full-width" style={{ marginTop: '1rem' }}>
              <label>PDF final firmado (opcional)</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  const file = e?.target?.files?.[0] || null;
                  if (!file) {
                    setArchivoPdfFinal(null);
                    setErrorArchivo(null);
                    return;
                  }
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
              {archivoPdfFinal ? (
                <div style={{ marginTop: 6, color: '#334155', fontSize: '0.85rem' }}>{archivoPdfFinal.name}</div>
              ) : null}
              {errorArchivo ? (
                <div style={{ marginTop: 6, color: '#dc2626', fontSize: '0.85rem' }}>{errorArchivo}</div>
              ) : null}
            </div>
          </FormularioOficio>
        </section>
        <section className="panel-vista-previa">
          <VistaPreviaOficio formData={formData} usuarios={catalogos.usuarios} />
        </section>
      </div>
    </div>
  );
};

export default GenerarOficioInternoPage;
