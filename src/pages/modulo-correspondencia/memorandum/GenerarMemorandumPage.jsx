import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { obtenerCorrespondenciaPorId } from '../../../features/modulo-correspondencia/correspondencia/services/correspondenciaService';
import { FormularioMemorandum } from '@/features/modulo-correspondencia/memorandum/components/FormularioMemorandum';
import { VistaPreviaMemorandum } from '@/features/modulo-correspondencia/memorandum/components/VistaPreviaMemorandum';
import { useMemorandum } from '@/features/modulo-correspondencia/memorandum/hooks/useMemorandum';
import { useCatalogos } from '../../../shared/hooks/useCatalogos';
import '@/features/modulo-correspondencia/memorandum/styles/memorandum.css';

export const GenerarMemorandumPage = () => {
  const { idCorrespondencia } = useParams();
  const [correspondencia, setCorrespondencia] = useState(null);
  const [loadingCorr, setLoadingCorr] = useState(true);
  const catalogos = useCatalogos();

 useEffect(() => {
    if (!idCorrespondencia) {
        setLoadingCorr(false); // ← agregar esto
        return;
    }
    obtenerCorrespondenciaPorId(idCorrespondencia)
        .then(data => setCorrespondencia(data))
        .catch(err => console.error('Error al cargar correspondencia:', err))
        .finally(() => setLoadingCorr(false));
}, [idCorrespondencia]);

  const { formData, setFormData, handleChange, handleSubmit } = useMemorandum(correspondencia);

  if (loadingCorr) {
    return <div className="sigcqal-page-container"><p>Cargando correspondencia...</p></div>;
  }

  return (
    <div className="sigcqal-page-container">
      <div className="split-view-container">
        <section className="panel-formulario">
          <FormularioMemorandum
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            catalogos={catalogos}
          />
        </section>
        <section className="panel-vista-previa">
          <VistaPreviaMemorandum
            formData={formData}
            usuarios={catalogos.usuarios}
          />
        </section>
      </div>
    </div>
  );
};