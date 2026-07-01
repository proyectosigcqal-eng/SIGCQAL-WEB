import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCatalogos } from '@/shared/hooks/useCatalogos';
import { fileUrl } from '@/shared/config/api'; // <- Usamos tu configurador de URL estática
import { FormularioQuejaRlCir } from '@/features/modulo-area-sustantiva/rl-cir/quejaRlCir/components/FormularioQuejaRlCir';
import { VistaPreviaQuejaRlCir } from '@/features/modulo-area-sustantiva/rl-cir/quejaRlCir/components/VistaPreviaQuejaRlCir';

import { crearQuejaRlCir, obtenerResolucionPorId } from '@/features/modulo-area-sustantiva/rl-cir/quejaRlCir/services/quejaRlCirService';

const obtenerFechaActual = () => {
  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];
  const hoy = new Date();
  const dia = String(hoy.getDate()).padStart(2, '0');
  const mes = meses[hoy.getMonth()];
  const anio = hoy.getFullYear();
  return `${dia} de ${mes} de ${anio}`;
};

const ESTADO_INICIAL = {
  idResolucionFinal: 1, 
  fechaEmision: obtenerFechaActual(),
  motivos: '',
  articulos: '',
  observaciones: '',
  oficio: '',
  idAsesorRemitente: '',
  idAsesorRecibe: '',
  director: ''
};

export const CrearQuejaRlCirPage = () => {
  const navigate = useNavigate();
  const catalogos = useCatalogos();

  const [formData, setFormData] = useState(ESTADO_INICIAL);
  const [datosResolucion, setDatosResolucion] = useState(null); 
  const [cargando, setCargando] = useState(false);
  
  // Clonado de QuejasAri: Manejo del estado como URL directa
  const [downloadUrl, setDownloadUrl] = useState(null);

  // Helper idéntico a QuejasAri adaptado a las propiedades de tu DTO RL_CIR
  const extraerRutaArchivo = (resultado) => {
    if (!resultado) return null;
    if (typeof resultado === 'string') return resultado;
    if (typeof resultado === 'object') {
      return resultado.rutaPdfQuejaRlCir // <- Propiedad que viene en tu DTO
        || resultado.rutaDocxQuejaRlCir
        || resultado.url
        || resultado.archivo
        || null;
    }
    return null;
  };

  const construirUrlDescarga = (ruta) => (ruta ? fileUrl(ruta) : null);

  useEffect(() => {
    if (formData.idResolucionFinal) {
      obtenerResolucionPorId(formData.idResolucionFinal)
        .then(data => setDatosResolucion(data))
        .catch(err => console.error("No se pudieron cargar los datos de vista previa:", err));
    }
  }, [formData.idResolucionFinal]);

  const handleChange = (e) => {
    const name = e.target ? e.target.name : e.name;
    const value = e.target ? e.target.value : e.value;

    if (name === 'idAsesorRemitente' || name === 'idAsesorRecibe') {
      setFormData(prev => ({ ...prev, [name]: value ? Number(value) : '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    const fechaFormatoJava = `${anio}-${mes}-${dia}`; 

    const payloadListo = { ...formData, fechaEmision: fechaFormatoJava };
    
    try {
      const res = await crearQuejaRlCir(payloadListo);
      
      // Extraemos la ruta del documento exactamente como lo hace QuejasAri
      const rutaDescarga = extraerRutaArchivo(res);
      const urlFinal = construirUrlDescarga(rutaDescarga);
      
      setDownloadUrl(urlFinal);

      alert(`Documento Queja RL_CIR generado con éxito.${rutaDescarga ? ' Ya está disponible para descargar.' : ''}`);
    } catch (err) {
      console.error(err);
      alert('Error al guardar la queja.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="sigcqal-page-container">
      <div className="split-view-container">
        
        <section className="panel-formulario">
          <h2>Generar Registro Queja RL_CIR</h2>
          <FormularioQuejaRlCir
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            catalogos={catalogos}
            cargando={cargando}
            downloadUrl={downloadUrl} // <- Le regresamos 'downloadUrl' a tu formulario original
          />

          <button 
            type="button" 
            className="btn-secundario" 
            onClick={() => navigate(-1)} 
            style={{ marginTop: '1rem', width: '100%' }}
          >
            ← Regresar
          </button>
        </section>

        <section className="panel-vista-previa-contenedor" style={{ height: '100%', overflow: 'hidden' }}>
          <VistaPreviaQuejaRlCir 
            formData={formData} 
            datosResolucion={datosResolucion} 
            asesores={catalogos?.asesores || catalogos?.usuarios || []} 
            downloadUrl={downloadUrl} // Pasado también a la vista previa por consistencia
          />
        </section>

      </div>
    </div>
  );
};

export default CrearQuejaRlCirPage;