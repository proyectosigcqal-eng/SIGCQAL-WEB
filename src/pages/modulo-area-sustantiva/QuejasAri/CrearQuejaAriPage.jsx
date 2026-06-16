import React, { useEffect, useState } from 'react';
import { useCatalogos } from '@/shared/hooks/useCatalogos';
import { FormularioQuejaAri } from '@/features/modulo-area-sustantiva/QuejasAri/components/FormularioQuejaAri';
import { VistaPreviaQuejaAri } from '@/features/modulo-area-sustantiva/QuejasAri/components/VistaPreviaQuejaAri';
import { crearQuejaAri, obtenerQuejaAriPorId } from '@/features/modulo-area-sustantiva/QuejasAri/services/quejasAriService';
import '@/features/modulo-area-sustantiva/QuejasAri/styles/quejasAri.css';

export const CrearQuejaAriPage = () => {
  const catalogos = useCatalogos();
  
  // Estado alineado exactamente al QuejasAriRequestDTO con IDs provisionales
  // y propiedades extendidas añadidas para la renderización de la vista previa
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
    instituto: '',
    
    // NUEVOS: Campos enriquecidos agregados al estado para la vista previa
    folioGobierno: '',
    nombreAsesor: '',
    rfcAsesor: '',
    nombreRepresentante: '',
    nombreContribuyente: '',
    identificacionContribuyente: '',
    fechaSolicitud: ''
  });
  
  const [cargando, setCargando] = useState(false);

 useEffect(() => {
  const cargarDatosEnriquecidos = async () => {
    if (formData.idQueja) {
      try {
        const datosQueja = await obtenerQuejaAriPorId(formData.idQueja);
        if (datosQueja) {
          setFormData(prev => ({
            ...prev,
            // Conservamos los IDs y datos nativos del formulario
            idQueja: datosQueja.id || prev.idQueja,
            
            // 🔍 Extracción segura: Soporta si el Back devuelve el objeto entidad o un DTO plano
            folioGobierno: datosQueja.folioGobierno || datosQueja.folio || '',
            
            nombreAsesor: datosQueja.asesor?.nombreCompleto || datosQueja.nombreAsesor || '',
            rfcAsesor: datosQueja.asesor?.rfc || datosQueja.rfcAsesor || '',
            
            nombreRepresentante: datosQueja.representanteLegal || datosQueja.nombreRepresentante || '',
            
            nombreContribuyente: datosQueja.contribuyente?.nombreCompleto || datosQueja.nombreContribuyente || '',
            identificacionContribuyente: datosQueja.contribuyente?.rfc || datosQueja.identificacionContribuyente || '',
            
            fechaSolicitud: datosQueja.fechaSolicitud || datosQueja.fecha_solicitud || ''
          }));
        }
      } catch (err) {
        console.warn("No se pudieron pre-cargar los datos relacionales de la queja:", err.message);
      }
    }
  };
  cargarDatosEnriquecidos();
}, [formData.idQueja]);

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
    const parsedValue = name.startsWith('id') && value !== '' ? Number(value) : value;
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      // El payload va perfectamente estructurado para el backend
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