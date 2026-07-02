import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCatalogos } from '@/shared/hooks/useCatalogos';
import { fileUrl } from '@/shared/config/api';
import { FormularioQuejaAri } from '@/features/modulo-area-sustantiva/QuejasAri/components/FormularioQuejaAri';
import { VistaPreviaQuejaAri } from '@/features/modulo-area-sustantiva/QuejasAri/components/VistaPreviaQuejaAri';
import {
  crearQuejaAri,
  obtenerContextoAriPorFolio, // ← nuevo, ver abajo
  listarAriPorIdQueja,        // ← nuevo, ver abajo
} from '@/features/modulo-area-sustantiva/QuejasAri/services/quejasAriService';
import '@/features/modulo-area-sustantiva/QuejasAri/styles/quejasAri.css';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_dev';

const ESTADO_INICIAL = {
  idQueja: null,
  idCir: null,
  numExpedienteOficial: '',
  sintesisActosOmisiones: '',
  nombreEncargadoFirma: '',
  fechaAcuerdo: '',
  idPlantillaQuejaAri: '',
  multasRequerimientos: '',
  multasCredito: '',
  instituto: '',
  abreviaturaEncargado: '',
  folioGobierno: '',
  nombreAsesor: '',
  rfcAsesor: '',
  nombreRepresentante: '',
  nombreContribuyente: '',
  identificacionContribuyente: '',
  fechaSolicitud: '',
};

export const CrearQuejaAriPage = () => {
  const { folio } = useParams();
  const navigate = useNavigate();
  const catalogos = useCatalogos();

  const [formData, setFormData]   = useState(ESTADO_INICIAL);
  const [cargando, setCargando]   = useState(false);
  const [cargandoCtx, setCargandoCtx] = useState(true);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [errorCtx, setErrorCtx]   = useState(null);

  const extraerRutaArchivo = (resultado) => {
    if (!resultado) return null;
    if (typeof resultado === 'string') return resultado;
    if (typeof resultado === 'object') {
      return resultado.rutaPdfAri
        || resultado.url
        || resultado.urlDescarga
        || resultado.archivo
        || resultado.rutaArchivo
        || resultado.fileUrl
        || resultado.path
        || (resultado.nombreArchivo ? `/api/files/quejas-ari/${resultado.nombreArchivo}` : null)
        || null;
    }
    return null;
  };

  const construirUrlDescarga = (ruta) => (ruta ? fileUrl(ruta) : null);

  // ── 1. Resolver idQueja/idCir desde el folio + revisar si ya existe un ARI ──
  useEffect(() => {
    if (!folio) { setCargandoCtx(false); return; }

    (async () => {
      try {
        // a) idQueja / idCir reales para este folio (endpoint nuevo)
        const ctx = await obtenerContextoAriPorFolio(folio);
        if (!ctx?.idQueja) {
          setErrorCtx('No se encontró una queja asociada a este folio.');
          return;
        }

        // b) prefill de datos de contexto — reutiliza el endpoint que ya usa el checklist
        let prefill = {};
        try {
  const res = await fetch(`${API_BASE}/api/v1/expedientes/${folio}/detalle-asesoria`);
  if (res.ok) {
    const detalle = await res.json();
    console.log('>>> detalle-asesoria completo:', detalle); // ← VER QUÉ TRAE
   prefill = {
  folioGobierno:               folio,
  nombreContribuyente:         detalle?.contribuyente                ?? '',
  // ✅ el backend devuelve snake_case — hay que leerlos así
  nombreAsesor:                detalle?.nombre_asesor                ?? '',
  rfcAsesor:                   detalle?.rfc_asesor                   ?? '',
  nombreRepresentante:         detalle?.nombre_representante         ?? '',
  identificacionContribuyente: detalle?.identificacion_contribuyente ?? '',
  fechaSolicitud:              detalle?.fecha_solicitud              ?? '',
};
  }
        } catch {
          // no crítico — el formulario sigue disponible aunque no haya prefill
        }

        setFormData(prev => ({
          ...prev,
          idQueja: ctx.idQueja,
          idCir: ctx.idCir ?? null,
          ...prefill,
        }));

        // c) ¿ya existe un ARI para esta queja? (VER ARI y GENERAR ARI comparten ruta)
        const ariExistentes = await listarAriPorIdQueja(ctx.idQueja);
        if (Array.isArray(ariExistentes) && ariExistentes.length > 0) {
          const existente = ariExistentes[0];
          setFormData(prev => ({ ...prev, ...existente }));
          setDownloadUrl(construirUrlDescarga(extraerRutaArchivo(existente)));
        }
      } catch (err) {
        console.error('Error al cargar contexto de ARI:', err);
        setErrorCtx('No se pudo cargar la información del expediente.');
      } finally {
        setCargandoCtx(false);
      }
    })();
  }, [folio]);

  // ── 2. Plantilla por defecto ──
  useEffect(() => {
    if (catalogos?.plantillasQuejaAri?.length > 0 && !formData.idPlantillaQuejaAri) {
      setFormData(prev => ({ ...prev, idPlantillaQuejaAri: catalogos.plantillasQuejaAri[0].id }));
    }
  }, [catalogos?.plantillasQuejaAri]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name.startsWith('id') && value !== '' ? Number(value) : value;
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.idQueja) {
      alert('No se pudo determinar la queja asociada a este folio.');
      return;
    }

    setCargando(true);
    try {
      const payload = {
        ...formData,
        fechaAcuerdo: formData.fechaAcuerdo || null, // nunca '' a un LocalDate
      };

      const res = await crearQuejaAri(payload);

      const rutaDescarga = extraerRutaArchivo(res);
      setDownloadUrl(construirUrlDescarga(rutaDescarga));

      alert(`Queja ARI creada correctamente${rutaDescarga ? '. Ya está disponible para descargar.' : ''}`);
    } catch (err) {
      console.error('Error al crear queja ARI', err);
      alert('Error al crear la queja ARI');
    } finally {
      setCargando(false);
    }
  };

  if (cargandoCtx) {
    return <div className="sigcqal-page-container">Cargando información del expediente...</div>;
  }

  if (errorCtx) {
    return (
      <div className="sigcqal-page-container">
        <p>{errorCtx}</p>
        <button onClick={() => navigate('/atencion-juridica/bandeja')}>Volver a la bandeja</button>
      </div>
    );
  }

  return (
    <div className="sigcqal-page-container">
      <div className="split-view-container">
        <section className="panel-formulario">
          <FormularioQuejaAri
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            catalogos={catalogos}
            cargando={cargando}
            downloadUrl={downloadUrl}
          />
          <button
            type="button"
            onClick={() => navigate('/atencion-juridica/bandeja')}
            style={{ marginTop: '1rem' }}
          >
            ← Volver a la bandeja
          </button>
        </section>

        <section className="panel-vista-previa-contenedor" style={{ height: '100%', overflow: 'hidden' }}>
          <VistaPreviaQuejaAri
            formData={formData}
            usuarios={catalogos.usuarios}
            areaDestino={{ nombre: '', nombreArea: '' }}
            downloadUrl={downloadUrl}
          />
        </section>
      </div>
    </div>
  );
};

export default CrearQuejaAriPage;