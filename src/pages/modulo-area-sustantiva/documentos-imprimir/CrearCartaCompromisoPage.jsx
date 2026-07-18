import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormularioCartaCompromiso } from '@/features/modulo-area-sustantiva/documentos-imprimir/components/FormularioCartaCompromiso';
import { VistaPreviaCartaCompromiso } from '@/features/modulo-area-sustantiva/documentos-imprimir/components/VistaPreviaCartaCompromiso';
import { generarPlantilla } from '@/features/modulo-area-sustantiva/documentos-imprimir/services/plantillaService';
import '@/features/modulo-area-sustantiva/documentos-imprimir/styles/cartaCompromiso.css';

const ESTADO_INICIAL = {
  nombreContribuyente: '',
};

export const CrearCartaCompromisoPage = () => {
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
      // Mapeo exacto del parámetro que espera el Backend: {{NOMBRE_CONTRIBUYENTE}}
      const variables = {
        NOMBRE_CONTRIBUYENTE: formData.nombreContribuyente,
      };

      // Invocación con el identificador exacto de la plantilla solicitado
      const blob = await generarPlantilla('carta_compromiso_representacion_legal', variables);

      // Crear URL para descarga
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);

      alert('¡Carta compromiso generada con éxito! Ya puede descargarla.');
    } catch (err) {
      console.error(err);
      alert('Error al generar la carta compromiso. Verifique la conexión con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="sigcqal-page-container">
      <div className="page-header">
        <h1>Carta Compromiso de Representación Legal</h1>
      </div>
      <div className="split-view-container">
        
        {/* Panel del Formulario */}
        <section className="panel-formulario">
          <FormularioCartaCompromiso
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

        {/* Panel de la Vista Previa */}
        <section className="panel-vista-previa-contenedor">
          <VistaPreviaCartaCompromiso formData={formData} />
        </section>
        
      </div>
    </div>
  );
};

export default CrearCartaCompromisoPage;