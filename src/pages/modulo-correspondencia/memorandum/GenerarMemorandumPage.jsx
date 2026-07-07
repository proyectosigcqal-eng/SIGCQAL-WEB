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

  const { formData, setFormData, handleChange, handleSubmit } = useMemorandum(correspondencia, catalogos);

  if (loadingCorr) {
    return <div className="sigcqal-page-container"><p>Cargando correspondencia...</p></div>;
  }

  return (
   <div className="sigcqal-page-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="generar-memorandum-container" style={{ display: 'grid', gridTemplateColumns: '45% 55%', flex: '1', minHeight: '0', overflow: 'hidden' }}>
        <section className="panel-formulario" style={{ height: '100%', overflowY: 'auto' }}>       <FormularioMemorandum
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            catalogos={catalogos}
          />
        </section>
        <section className="panel-vista-previa" style={{ height: '100%', overflowY: 'auto' }}>
         <VistaPreviaMemorandum
          formData={formData}
          usuarios={catalogos.usuarios}
          areaDestino={{
            // ✅ Buscar el nombre del área seleccionada en el formulario
            nombre: catalogos.areas?.find(a => a.id === Number(formData.idArea))?.nombre || '',
            nombreArea: catalogos.areas?.find(a => a.id === Number(formData.idArea))?.nombre || '',
          }}
        />
        </section>
      </div>
    </div>
  );
};