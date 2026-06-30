import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCatalogos } from '@/shared/hooks/useCatalogos';
import { crearQuejaRlCir, obtenerResolucionPorId } from '@/features/modulo-area-sustantiva/rl-cir/quejaRlCir/services/quejaRlCirService';
import { FormularioQuejaRlCir } from '@/features/modulo-area-sustantiva/rl-cir/quejaRlCir/components/FormularioQuejaRlCir';
import { VistaPreviaQuejaRlCir } from '@/features/modulo-area-sustantiva/rl-cir/quejaRlCir/components/VistaPreviaQuejaRlCir';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_dev';

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
  const [datosResolucion, setDatosResolucion] = useState(null); // Estado para almacenar los datos extras del backend
  const [cargando, setCargando] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  // Efecto para buscar los datos por Id de resolución final sin alterar el payload a enviar
  useEffect(() => {
    if (formData.idResolucionFinal) {
      obtenerResolucionPorId(formData.idResolucionFinal)
        .then(data => {
          setDatosResolucion(data);
        })
        .catch(err => console.error("No se pudieron cargar los datos de vista previa:", err));
    }
  }, [formData.idResolucionFinal]);

  const handleChange = (e) => {
    const name = e.target ? e.target.name : e.name;
    const value = e.target ? e.target.value : e.value;

    if (name === 'idAsesorRemitente' || name === 'idAsesorRecibe') {
      setFormData(prev => ({
        ...prev,
        [name]: value ? Number(value) : ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    // 1. Obtenemos el día de hoy en formato internacional YYYY-MM-DD
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    const fechaFormatoJava = `${anio}-${mes}-${dia}`; // "2026-06-30"

    // 2. Creamos una copia del payload reemplazando únicamente la fecha de emisión
    const payloadListo = {
      ...formData,
      fechaEmision: fechaFormatoJava
    };
    
    console.log("PAYLOAD ENVIADO A /queja-rl-cir/generar (CORREGIDO):", payloadListo);
    
    try {
      // 3. Enviamos el payload corregido al backend
      const res = await crearQuejaRlCir(payloadListo);
      if (res?.id) {
        setDownloadUrl(`${API_BASE}/api/v1/queja-rl-cir/${res.id}/descargar`);
      }
      alert('Documento Queja RL_CIR generado con éxito.');
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
            downloadUrl={downloadUrl}
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
            datosResolucion={datosResolucion} // Pasamos los campos extras aquí
            asesores={catalogos?.asesores || catalogos?.usuarios || []} 
          />
        </section>

      </div>
    </div>
  );
};

export default CrearQuejaRlCirPage;