import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormularioInformeTerminacion } from '@/features/modulo-area-sustantiva/documentos-imprimir/components/FormularioInformeTerminacion';
import { VistaPreviaInformeTerminacion } from '@/features/modulo-area-sustantiva/documentos-imprimir/components/VistaPreviaInformeTerminacion';
import { generarPlantilla } from '@/features/modulo-area-sustantiva/documentos-imprimir/services/plantillaService'; // Importación del nuevo servicio de Axios
import '@/features/modulo-area-sustantiva/documentos-imprimir/styles/informeTerminacion.css';

const ESTADO_INICIAL = {
  nombreContribuyente: '',
  nombreEncargado: '',
  nombreAsesor: '',
};

export const CrearInformeTerminacionPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(ESTADO_INICIAL);
  const [cargando, setCargando] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      // Formateamos el payload tal como lo espera el controlador del Backend
      const variables = {
        NOMBRE_CONTRIBUYENTE: formData.nombreContribuyente,
        NOMBRE_ENCARGADO: formData.nombreEncargado,
        NOMBRE_ASESOR: formData.nombreAsesor
      };

      // Invocamos el servicio Axios pasándole la plantilla correcta
      const blob = await generarPlantilla('informe_terminacion_servicio', variables);

      // Creamos la URL temporal del Blob para la descarga
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);

      alert('¡Informe generado con éxito! Puede descargarlo usando el botón de descarga.');
    } catch (err) {
      console.error(err);
      alert('Error al generar el documento. Verifique que el servidor del back esté disponible.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="sigcqal-page-container">
      <div className="page-header">
        <h1>Informe de Terminación de Servicio</h1>
      </div>
      <div className="split-view-container">
        
        {/* Sección del Formulario para entrada de datos */}
        <section className="panel-formulario">
          <FormularioInformeTerminacion
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            cargando={cargando}
            downloadUrl={downloadUrl}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '5rem' }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{
                backgroundColor: 'transparent',
                color: '#1e2235',
                border: 'none',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.7'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              ← Volver
            </button>
          </div>
        </section>

        {/* Sección de Vista Previa del Documento e impresión */}
        <section className="panel-vista-previa-contenedor">
          <VistaPreviaInformeTerminacion formData={formData} />
        </section>
        
      </div>
    </div>
  );
};

export default CrearInformeTerminacionPage;