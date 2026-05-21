import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { obtenerCorrespondenciaPorId } from '../../../features/modulo-correspondencia/correspondencia/services/correspondenciaService';
import { FormularioOficio } from '@/features/modulo-correspondencia/oficio/components/FormularioOficio';
import { VistaPreviaOficio } from '@/features/modulo-correspondencia/oficio/components/VistaPreviaOficio';
import { useOficio } from '@/features/modulo-correspondencia/oficio/hooks/useOficio';
import { useCatalogos } from '../../../shared/hooks/useCatalogos';
import '@/features/modulo-correspondencia/oficio/styles/oficio.css';

export const GenerarOficioPage = () => {
  const { id } = useParams();
  const [correspondencia, setCorrespondencia] = useState(null);
  const [loadingCorr, setLoadingCorr] = useState(true);
  const catalogos = useCatalogos();

  useEffect(() => {
    if (!id) {
      setLoadingCorr(false);
      return;
    }
    obtenerCorrespondenciaPorId(id)
      .then((data) => setCorrespondencia(data))
      .catch((err) => console.error('Error al cargar correspondencia:', err))
      .finally(() => setLoadingCorr(false));
  }, [id]);

  const { formData, setFormData, handleChange, handleSubmit } = useOficio(correspondencia, catalogos);

  if (loadingCorr) {
    return (
      <div className="sigcqal-page-container">
        <p>Cargando correspondencia...</p>
      </div>
    );
  }

  return (
    <div className="sigcqal-page-container">
      <div className="split-view-container">
        <section className="panel-formulario">
          <FormularioOficio
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            catalogos={catalogos}
          />
        </section>
        <section className="panel-vista-previa">
          <VistaPreviaOficio
            formData={formData}
            usuarios={catalogos.usuarios}
            areaDestino={{ nombre: correspondencia?.dependenciaRemitente || correspondencia?.nombreArea || '' }}
          />
        </section>
      </div>
    </div>
  );
};

export default GenerarOficioPage;
