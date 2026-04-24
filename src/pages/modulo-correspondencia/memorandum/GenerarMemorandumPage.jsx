import { FormularioMemorandum } from '@/features/modulo-correspondencia/memorandum/components/FormularioMemorandum';
import { VistaPreviaMemorandum } from '@/features/modulo-correspondencia/memorandum/components/VistaPreviaMemorandum';
import { useMemorandum } from '@/features/modulo-correspondencia/memorandum/hooks/useMemorandum';
import { useCatalogos } from '../../../shared/hooks/useCatalogos';
import { useNavigate } from 'react-router-dom';
import '@/features/modulo-correspondencia/memorandum/styles/memorandum.css';

const mockCorrespondencia = {
  id: 3,
  idArea: 1,
  asunto: "SOLICITUD DE AUDITORÍA INTERNA 2026",
  folioUnico: "COR-2026-0089",
  nombreUsuarioEmisor: "Juan Pérez García"
};

export const GenerarMemorandumPage = () => {
  const { formData, setFormData, handleChange, handleSubmit } = useMemorandum(mockCorrespondencia);
 const navigate = useNavigate();
  const catalogos = useCatalogos(); 

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

         <button 
          onClick={() => navigate('/correspondencia/bitacora/1')}
          style={{ 
            position: 'fixed', 
            bottom: '20px', 
            right: '20px', 
            zIndex: 1000, 
            padding: '10px', 
            background: '#2c3e50', 
            color: 'white', 
            borderRadius: '5px',
            cursor: 'pointer',
            border: 'none'
          }}
        >
          Probar Bitácora (ID: 1)
        </button>
      </div>
     
    </div>
  );
};