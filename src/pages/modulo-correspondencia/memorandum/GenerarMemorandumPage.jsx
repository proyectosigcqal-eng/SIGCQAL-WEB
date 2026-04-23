// src/pages/modulo-correspondencia/memorandum/GenerarMemorandumPage.jsx
import { FormularioMemorandum } from '@/features/modulo-correspondencia/memorandum/components/FormularioMemorandum';
import { VistaPreviaMemorandum } from '@/features/modulo-correspondencia/memorandum/components/VistaPreviaMemorandum';
import { useMemorandum } from '@/features/modulo-correspondencia/memorandum/hooks/useMemorandum';
import '@/features/modulo-correspondencia/memorandum/styles/memorandum.css';

const mockCorrespondencia = {
  id: 452,
  idArea: 1,
  asunto: "SOLICITUD DE AUDITORÍA INTERNA 2026",
  folioUnico: "COR-2026-0089",
  nombreUsuarioEmisor: "Juan Pérez García"
};

export const GenerarMemorandumPage = () => {

  const { formData, handleChange, handleSubmit } = useMemorandum(mockCorrespondencia);

  return (
    <div className="sigcqal-page-container">
      <div className="split-view-container">
        <section className="panel-formulario">
          <FormularioMemorandum 
        formData={formData} 
        handleChange={handleChange} 
        handleSubmit={handleSubmit} 
    />
        </section>
        <section className="panel-vista-previa">
          <VistaPreviaMemorandum />
        </section>
      </div>
    </div>
  );
};