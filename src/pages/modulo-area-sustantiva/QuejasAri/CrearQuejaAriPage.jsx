import React, { useEffect, useState } from 'react';
import { useCatalogos } from '@/shared/hooks/useCatalogos';
import { FormularioQuejaAri } from '@/features/modulo-area-sustantiva/QuejasAri/components/FormularioQuejaAri';
import { VistaPreviaQuejaAri } from '@/features/modulo-area-sustantiva/QuejasAri/components/VistaPreviaQuejaAri';
import { crearQuejaAri } from '@/features/modulo-area-sustantiva/QuejasAri/services/quejasAriService';
import '@/features/modulo-area-sustantiva/QuejasAri/styles/quejasAri.css';

export const CrearQuejaAriPage = () => {
  const catalogos = useCatalogos();
  
  // CORREGIDO: Estado alineado exactamente al QuejasAriRequestDTO con IDs "hardcodeados" provisionalmente
  const [formData, setFormData] = useState({
    idQueja: 1, // Forzado provisionalmente
    idCir: 1,   // Forzado provisionalmente
    numExpedienteOficial: '',
    sintesisActosOmisiones: '',
    nombreEncargadoFirma: '',
    fechaAcuerdo: '',
    idPlantillaQuejaAri: '',
    multasRequerimientos: '',
    multasCredito: '',
    instituto: '' // Agregado según el DTO
  });
  
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (catalogos?.plantillasQuejaAri?.length > 0 && !formData.idPlantillaQuejaAri) {
      setFormData(prev => ({
        ...prev,
        idPlantillaQuejaAri: catalogos.plantillasQuejaAri[0].id
      }));
    }
  }, [catalogos?.plantillasQuejaAri]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Aseguramos que si cambias un ID manualmente en un input, se guarde como número
    const parsedValue = name.startsWith('id') && value !== '' ? Number(value) : value;
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      // El payload ya va perfectamente estructurado para el backend
      const payload = { ...formData };
      const res = await crearQuejaAri(payload);
      console.log('Queja ARI creada exitosamente en el backend:', res);
      alert('Queja ARI creada correctamente');
    } catch (err) {
      console.error('Error al crear queja ARI', err);
      alert('Error al crear la queja ARI');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="sigcqal-page-container">
      <div className="split-view-container">
        {/* Panel Izquierdo: Formulario */}
        <section className="panel-formulario">
          <FormularioQuejaAri
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            catalogos={catalogos}
            cargando={cargando}
          />
        </section>

        {/* Panel Derecho: Vista previa adaptada */}
        <section className="panel-vista-previa-contenedor" style={{ height: '100%', overflow: 'hidden' }}>
          <VistaPreviaQuejaAri
            formData={formData}
            usuarios={catalogos.usuarios}
            areaDestino={{
              nombre: '',
              nombreArea: '',
            }}
          />
        </section>
      </div>
    </div>
  );
};

export default CrearQuejaAriPage;