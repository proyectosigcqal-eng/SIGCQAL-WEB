import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { obtenerCorrespondenciaPorId } from '../../../features/modulo-correspondencia/correspondencia/services/correspondenciaService';
import { FormularioOficio } from '@/features/modulo-correspondencia/oficio/components/FormularioOficio';
import { VistaPreviaOficio } from '@/features/modulo-correspondencia/oficio/components/VistaPreviaOficio';
import { guardarOficioContestacion } from '../../../features/modulo-correspondencia/correspondencia/services/oficioContestacionService';
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
  const catalogos = useCatalogos();

  useEffect(() => {
    if (!idCorrespondencia) {
      setLoadingCorr(false);
      return;
    }
    obtenerCorrespondenciaPorId(idCorrespondencia)
      .then((data) => setCorrespondencia(data))
      .catch((err) => console.error('Error al cargar correspondencia:', err))
      .finally(() => setLoadingCorr(false));
  }, [idCorrespondencia]);

  const { formData, setFormData, handleChange } = useOficio(correspondencia, catalogos);

  const handleSubmitInterno = async (e) => {
    e.preventDefault();
    setErrorGuardar(null);
    if (!formData.folioUnico?.trim()) {
      setErrorNumOficio(true);
      document.getElementById('numOficioSalida')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setErrorNumOficio(false);
    setGuardando(true);
    try {
      const dto = {
        idCorrespondencia: Number(idCorrespondencia),
        idUsuarioEmisor: formData.idUsuarioEmisor || null,
        numOficioSalida: formData.folioUnico.trim(),
        asuntoContestacion: formData.asuntoCorrespondencia || null,
        cuerpoOficioTexto: formData.instruccionSeguimiento || null,
        urlPdfFinal: null
      };
      await guardarOficioContestacion(dto);
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
          />
        </section>
        <section className="panel-vista-previa">
          <VistaPreviaOficio formData={formData} usuarios={catalogos.usuarios} />
        </section>
      </div>
    </div>
  );
};

export default GenerarOficioInternoPage;
