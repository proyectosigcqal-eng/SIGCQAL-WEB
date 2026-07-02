import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCatalogos } from '@/shared/hooks/useCatalogos';
import { fileUrl } from '@/shared/config/api'; 
import { crearRLCir } from '@/features/modulo-area-sustantiva/rl-cir/rl-cir/services/rlCirService';
import { FormularioRLCir } from '@/features/modulo-area-sustantiva/rl-cir/rl-cir/components/FormularioRLCir';
import { VistaPreviaRLCir } from '@/features/modulo-area-sustantiva/rl-cir/rl-cir/components/VistaPreviaRLCir';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_Prod';

const ESTADO_INICIAL = {
  idExpediente: '', 
  fechaEmision: new Date().toISOString().split('T')[0],
  motivos: '',
  articulos: '',
  observaciones: '',
  idAsesorRemitente: '',
  idAsesorRecibe: '',
  director: '',
  folioGobierno: '',
  nombreContribuyente: '',
  nombreAsesorRemitente: '',
  nombreAsesorRecibe: '',
  identificacionOficial:''
};

export const CrearRLCirPage = () => {
  const { folio } = useParams(); 
  const navigate = useNavigate();
  const catalogos = useCatalogos();

  const [formData, setFormData] = useState(ESTADO_INICIAL);
  const [cargando, setCargando] = useState(false);
  const [cargandoCtx, setCargandoCtx] = useState(true);
  const [downloadUrl, setDownloadUrl] = useState(null); 
  const [errorCtx, setErrorCtx] = useState(null);

  // 1. Extractor adaptado específicamente a las llaves de respuesta para RL_CIR
  const extraerRutaArchivo = (resultado) => {
    if (!resultado) return null;
    if (typeof resultado === 'string') return resultado;
    if (typeof resultado === 'object') {
      return resultado.rutaDocxRLCir 
        || resultado.rutaPdfRLCir 
        || resultado.rutaRLCir
        || resultado.rutaArchivo
        || resultado.url
        || null;
    }
    return null;
  };

  const construirUrlDescarga = (ruta) => {
    if (!ruta) return null;
    // Si el backend ya devolvió la URL completa o la ruta relativa corregida de descargas
    if (ruta.startsWith('http') || ruta.startsWith('/api/files')) {
      return ruta.startsWith('http') ? ruta : `${API_BASE}${ruta}`;
    }
    return fileUrl(ruta);
  };

  // Cargar contexto del Expediente
  useEffect(() => {
    if (!folio) { setCargandoCtx(false); return; }

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/expedientes/${folio}`);
        
        if (res.ok) {
          const detalle = await res.json();
          
          let contribuyenteAsignado = '';
          if (detalle?.contribuyenteCompleto) {
            contribuyenteAsignado = detalle.contribuyenteCompleto;
          } else if (detalle?.solicitante) {
            contribuyenteAsignado = detalle.solicitante.razonSocial || 
                                    `${detalle.solicitante.nombre || ''} ${detalle.solicitante.apellidoPaterno || ''}`.trim();
          } else if (detalle?.nombreContribuyente) {
            contribuyenteAsignado = detalle.nombreContribuyente;
          } else {
            contribuyenteAsignado = detalle?.contribuyente || '';
          }

          setFormData(prev => ({
            ...prev,
            folioGobierno: folio, 
            idExpediente: detalle?.id || detalle?.idExpediente || detalle?.id_expediente ||'', 
            nombreContribuyente: contribuyenteAsignado,
            identificacionOficial: detalle?.identificacionOficial || detalle?.identificacion || ''
          }));

        } else {
          setErrorCtx(`El servidor respondió con código de error: ${res.status}`);
          setFormData(prev => ({ ...prev, folioGobierno: folio }));
        }
      } catch (err) {
        console.error('Error cargando contexto', err);
        setErrorCtx('No se pudo establecer comunicación con el módulo de expedientes.');
      } finally {
        setCargandoCtx(false);
      }
    })();
  }, [folio]);

  // Escuchar cambios de listas desplegables
  const handleChange = (e) => {
    const name = e.target ? e.target.name : e.name;
    const value = e.target ? e.target.value : e.value;
    const listaAsesores = catalogos?.asesores || catalogos?.usuarios || [];

    if (name === 'idAsesorRemitente') {
      const numId = value ? Number(value) : '';
      const objAsesor = listaAsesores.find(a => (a.idAsesor ?? a.id) === numId);
      
      setFormData(prev => ({
        ...prev,
        idAsesorRemitente: numId,
        nombreAsesorRemitente: objAsesor ? objAsesor.nombre : ''
      }));
    } else if (name === 'idAsesorRecibe') {
      const numId = value ? Number(value) : '';
      const objAsesor = listaAsesores.find(a => (a.idAsesor ?? a.id) === numId);
      
      setFormData(prev => ({
        ...prev,
        idAsesorRecibe: numId,
        nombreAsesorRecibe: objAsesor ? objAsesor.nombre : ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setDownloadUrl(null); // Limpiamos estados de descargas previas
    
    try {
      const res = await crearRLCir(formData);
      console.log("Respuesta real del Backend en Consola:", res);
      
      // 1. Validamos usando el identificador exacto que arrojó tu log: idRlCir
      if (res && res.idRlCir) {
        
        const idExpedienteReal = res.idExpediente || formData.idExpediente;
        const nombreArchivoDocx = `RL_CIR_EXP_${idExpedienteReal}.docx`;
        
        // 2. Apuntamos directo al controlador de descargas independientes que configuramos al inicio
        const urlDescargaDirecta = `${API_BASE}/api/files/RLCir/${nombreArchivoDocx}`;
        
        setDownloadUrl(urlDescargaDirecta);
        alert('Documento RL_CIR generado con éxito. El botón de descarga ya está disponible.');
      } else {
        alert('Documento generado, pero no se pudo recuperar el ID del registro para la descarga.');
      }
      
    } catch (err) {
      console.error(err);
      alert('Error al guardar y procesar la petición.');
    } finally {
      setCargando(false);
    }
  };

  if (cargandoCtx) return <div className="sigcqal-page-container">Cargando datos relacionales...</div>;

  return (
    <div className="sigcqal-page-container">
      {errorCtx && (
        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.5rem 2rem', fontSize: '0.875rem' }}>
          ⚠️ {errorCtx} (Formulario operando sin metadatos automáticos)
        </div>
      )}
      <div className="split-view-container">
        
        <section className="panel-formulario">
          <h2>Generar Registro RL_CIR</h2>
          <FormularioRLCir
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
          <VistaPreviaRLCir 
            formData={formData} 
            asesores={catalogos?.asesores || catalogos?.usuarios || []} 
          />
        </section>

      </div>
    </div>
  );
};

export default CrearRLCirPage;