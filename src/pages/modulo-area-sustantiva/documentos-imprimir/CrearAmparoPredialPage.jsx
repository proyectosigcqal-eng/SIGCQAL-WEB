import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormularioAmparoPredial } from '@/features/modulo-area-sustantiva/documentos-imprimir/components/FormularioAmparoPredial';
import { VistaPreviaAmparoPredial } from '@/features/modulo-area-sustantiva/documentos-imprimir/components/VistaPreviaAmparoPredial';
import { generarPlantilla } from '@/features/modulo-area-sustantiva/documentos-imprimir/services/plantillaService';
import '@/features/modulo-area-sustantiva/documentos-imprimir/styles/amparoPredial.css';

const ESTADO_INICIAL = {
  nombreContribuyente: '',
};

export const CrearAmparoPredialPage = () => {
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
      // Envía el nombre del contribuyente tal como lo requiere el Word en el backend
      const variables = {
        NOMBRE_CONTRIBUYENTE: formData.nombreContribuyente.toUpperCase()
      };

      const blob = await generarPlantilla('amparo_impuesto', variables);
      // URL del Blob temporal
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);

      alert('¡Hoja final de Amparo generada con éxito! Descárguela con el botón de descarga.');
    } catch (err) {
      console.error(err);
      alert('Error al generar el documento. Verifique la conexión con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="sigcqal-page-container">
      <div className="page-header">
        <h1>Hoja Final de Amparo - Impuesto Predial</h1>
      </div>
      <div className="split-view-container">
        
        {/* Panel Formulario */}
        <section className="panel-formulario">
          <FormularioAmparoPredial
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

        {/* Panel Vista Previa */}
        <section className="panel-vista-previa-contenedor">
          <VistaPreviaAmparoPredial formData={formData} />
        </section>
        
      </div>
    </div>
  );
};

export default CrearAmparoPredialPage;