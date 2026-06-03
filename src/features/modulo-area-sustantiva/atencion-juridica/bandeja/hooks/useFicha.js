import { useState, useEffect } from 'react';

// MOCK — reemplazar con GET /api/v1/expedientes/{folio}/detalle-asesoria
const MOCK_DETALLE = {
  '260000000': {
    folio: '260000000',
    fecha_registro: '26/05/2026',
    contribuyente: 'JUAN PÉREZ LÓPEZ',
    estatus_actual: 'EN CALIFICACIÓN',
    progreso_porcentaje: 45,
    analisis_legal: {
      clasificacion_atencion: 'ASESORÍA SIMPLIFICADA',
      autoridad_fiscal_emisora: 'MUNICIPIO DE GUADALUPE',
      tipo_acto_impuesto: 'IMPUESTO PREDIAL',
      estatus_expediente: 'ASESORÍA EN PROCESO',
      fundamento_analisis_juridico:
        'Se detecta cobro indebido por falta de actualización en base catastral conforme al Art. 12 de la Ley de Hacienda.',
    },
    // ── Nueva estructura de bitácora con 3 eventos fijos ──────────────────
    bitacora: {
      registro: {
        descripcion: 'Folio generado exitosamente: ' + '260000000',
        timestamp: 'HOY, 09:00 AM',
        usuario: 'Capturista SIGCQAL',
        adjunto: null,
        datosContribuyente: {
          Nombre: 'JUAN PÉREZ LÓPEZ',
          RFC: 'PELJ800101XXX',
          CURP: 'PELJ800101HZSRRN09',
          Teléfono: '492 000 0000',
          Correo: 'juan.perez@correo.com',
          Domicilio: 'Calle Hidalgo #123, Centro, Guadalupe, Zac.',
        },
      },
      calificacion: {
        descripcion:
          'Se detecta cobro indebido por falta de actualización en base catastral conforme al Art. 12 de la Ley de Hacienda. Clasificado como Asesoría Simplificada.',
        timestamp: 'HOY, 10:15 AM',
        usuario: 'Lic. Roberto Sosa',
        adjunto: null,
        datosContribuyente: null,
      },
      conclusion: {
        descripcion:
          'Asesor proporcionó orientación sobre el procedimiento para impugnar el cobro. Se adjunta constancia de remisión.',
        timestamp: 'HOY, 11:45 AM',
        usuario: 'Lic. Ramírez Torres',
        // TODO: reemplazar con URL real del PDF: `/api/v1/expedientes/${folio}/constancia-pdf`
        adjunto: '/documentos/constancia-260000000.pdf',
        datosContribuyente: null,
      },
    },
  },
  '260000003': {
    folio: '260000003',
    fecha_registro: '26/05/2026',
    contribuyente: 'LOGÍSTICA AVANZADA S.C.',
    estatus_actual: 'EN REGISTRO',
    progreso_porcentaje: 20,
    analisis_legal: {
      clasificacion_atencion: 'ASESORÍA SIMPLIFICADA',
      autoridad_fiscal_emisora: 'SEFIN',
      tipo_acto_impuesto: 'ISAI',
      estatus_expediente: 'ASESORÍA EN PROCESO',
      fundamento_analisis_juridico:
        'Asesoría inicial sobre cálculo de ISAI en adquisición de inmueble conforme a la Ley de Hacienda del Estado.',
    },
    bitacora: {
      registro: {
        descripcion: 'Folio generado exitosamente: ' + '260000003',
        timestamp: 'HOY, 11:00 AM',
        usuario: 'Capturista SIGCQAL',
        adjunto: null,
        datosContribuyente: {
          Nombre: 'LOGÍSTICA AVANZADA S.C.',
          RFC: 'LAV200101XXX',
          Teléfono: '493 111 1111',
          Correo: 'contacto@logistica.com',
          Domicilio: 'Blvd. Industrial #456, Fresnillo, Zac.',
        },
      },
      calificacion: null,   // aún no calificado
      conclusion: null,     // aún no concluido
    },
  },
};

export const useFicha = (folio) => {
  const [detalle, setDetalle] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!folio) return;
    setCargando(true);
    setError(null);

    // TODO: reemplazar con fetch real:
    // fetch(`/api/v1/expedientes/${folio}/detalle-asesoria`)
    //   .then(r => r.json()).then(setDetalle).catch(setError).finally(() => setCargando(false));
    const timer = setTimeout(() => {
      const data = MOCK_DETALLE[folio];
      if (data) {
        setDetalle(data);
      } else {
        setError('No se encontró el expediente con folio: ' + folio);
      }
      setCargando(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [folio]);

  const verDocumentos = () => {
    // TODO: window.open(`/api/v1/expedientes/${folio}/constancia-pdf`, '_blank');
    alert(`Abriendo PDF de Constancia de Remisión — folio ${folio}`);
  };

  return { detalle, cargando, error, verDocumentos };
};
