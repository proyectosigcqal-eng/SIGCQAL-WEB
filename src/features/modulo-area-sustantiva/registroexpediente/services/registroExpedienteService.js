import axios from 'axios';
import { API_HOST } from '@/shared/config/api';
import { createDireccion, createPersona, createContribuyente } from '@/shared/services/catalogosServices';

const EXPEDIENTES_URL = `${API_HOST}/api/v1/expedientes`;

const parseNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const getIdFromResponse = (response, keys = ['id', 'idPersona', 'id_persona', 'idContribuyente', 'id_contribuyentes']) => {
  if (!response || typeof response !== 'object') return null;
  for (const key of keys) {
    if (response[key] !== undefined && response[key] !== null) {
      return parseNumber(response[key]);
    }
  }
  return null;
};

export const registrarExpediente = async (formData) => {

  // 1. Domicilio Fiscal - Mapeando directamente desde las llaves reales que arrojó tu consola
  const direccionPayload = {
    calle: formData.domicilioFiscal.calle || null,
    
    // Leemos 'numExt' y 'numInt' porque tu consola demostró que así se llaman en tu formData
    numExt: formData.domicilioFiscal.numExt ? String(formData.domicilioFiscal.numExt).trim() : null,
    numInt: formData.domicilioFiscal.numInt ? String(formData.domicilioFiscal.numInt).trim() : null,
    
    colonia: formData.domicilioFiscal.colonia || null,
    cp: formData.domicilioFiscal.cp ? String(formData.domicilioFiscal.cp).trim() : null,
    
    // Ojo aquí: Si tu formulario guarda el estado en formData.domicilioFiscal.idEstado o .estado, lo validamos:
    idEstado: formData.domicilioFiscal.idEstado 
      ? parseNumber(formData.domicilioFiscal.idEstado) 
      : (formData.domicilioFiscal.estado ? parseNumber(formData.domicilioFiscal.estado) : null),
    
    // El municipio se extrae directo de la raíz del formulario
    idMunicipio: formData.idMunicipio ? parseNumber(formData.idMunicipio) : null
  };
  console.log("PAYLOAD REAL ENVIADO A CREATE_DIRECCION:", direccionPayload);

  const direccion = await createDireccion(direccionPayload);


  const direccionId = getIdFromResponse(direccion, ['id', 'idDireccion', 'id_direccion']);
  if (!direccionId) {
    throw new Error('No se pudo crear la dirección del contribuyente.');
  }
  // 2. Persona Contribuyente (Corregido a camelCase para PersonaRequestDTO)
  const personaContribuyentePayload = {
    nombre: formData.nombre,
    apellidoPaterno: formData.apellidoPaterno,
    apellidoMaterno: formData.apellidoMaterno,
    telefono: formData.telefono || null,
    telefonoFijo: formData.telefonoFijo || null,
    rfc: formData.rfc || null,
    rec: formData.rec || null,
    identificacionOficial: formData.identificacionNumero || null,
    tipoIdentificacion: formData.identificacionTipo || null,
    correo: formData.correoElectronico || null,
    comunidad: formData.tipoPersona || null,
    idDireccion: direccionId, // Mapeado correctamente a camelCase
    idTipoPersona: formData.tipoPersona === 'fisica' ? 1 : 2 // Evita mandar null si el back requiere el tipo
  };

  const personaContribuyente = await createPersona(personaContribuyentePayload);
  const personaContribuyenteId = getIdFromResponse(personaContribuyente, ['id', 'idPersona', 'id_persona']);
  if (!personaContribuyenteId) {
    throw new Error('No se pudo crear la persona del contribuyente.');
  }

  // 3. Crear el Contribuyente usando el ID obtenido
  // Nota: Asegúrate si este endpoint específico requiere id_persona o idPersona.
  const contribuyente = await createContribuyente({ idPersona: personaContribuyenteId });
  const contribuyenteId = getIdFromResponse(contribuyente, ['id', 'idContribuyente', 'id_contribuyentes']);
  if (!contribuyenteId) {
    throw new Error('No se pudo crear el contribuyente.');
  }

  // 4. Persona Solicitante (Corregido a camelCase y enviando idDireccion como null de forma segura)
  const solicitante = await createPersona({
    nombre: formData.solicitante.nombre,
    apellidoPaterno: formData.solicitante.apellidoPaterno,
    apellidoMaterno: formData.solicitante.apellidoMaterno,
    idDireccion: null,     // El Back-end procesará este null sin romper gracias al ternario
    idTipoPersona: null,   // Lo mismo para el tipo de persona
  });
  const solicitanteId = getIdFromResponse(solicitante, ['id', 'idPersona', 'id_persona']);
  if (!solicitanteId) {
    throw new Error('No se pudo crear la persona del solicitante.');
  }

  // 5. Persona Representante Legal (Corregido a camelCase)
  const representante = await createPersona({
    nombre: formData.representanteLegal.nombre,
    apellidoPaterno: formData.representanteLegal.apellidoPaterno,
    apellidoMaterno: formData.representanteLegal.apellidoMaterno,
    idDireccion: null,
    idTipoPersona: null,
  });
  const representanteLegalId = getIdFromResponse(representante, ['id', 'idPersona', 'id_persona']);
  if (!representanteLegalId) {
    throw new Error('No se pudo crear la persona del representante legal.');
  }

  const getIdTipoTramite = (clasificacion) => {
    switch (clasificacion) {
      case 'asesoria':
        return 1;
      case 'queja':
        return 2;
      case 'representacion':
        return 3;
      default:
        return null;
    }
  };

  // 6. Registro final del Expediente
  const expedientePayload = {
    fechaSolicitud: `${formData.fechaSolicitud}T00:00:00`,
    idMunicipio: parseNumber(formData.idMunicipio),
    idAsesor: parseNumber(formData.idAsesorResponsable),
    idTipoTramite: getIdTipoTramite(formData.clasificacionAtencion),
    idEstatusExpediente: 1,
    documentoAcreditaPersonalidad: formData.documentoPersonalidad || null,
    archivoDocumentoAcreditaPersonalidad: formData.archivoDocumentoPersonalidad?.name || null,
    idContribuyente: contribuyenteId,
    idSolicitante: solicitanteId,
    idRepresentanteLegal: representanteLegalId,
  };

  const response = await axios.post(EXPEDIENTES_URL, expedientePayload);
  const expedienteGuardado = response.data;
  const folio = expedienteGuardado.folioGobierno;

  // 7. ✅ Subir archivo de personalidad si existe
  if (formData.archivoDocumentoPersonalidad && folio) {
    const fd = new FormData();
    fd.append('archivo', formData.archivoDocumentoPersonalidad);
    await axios.post(`${EXPEDIENTES_URL}/${folio}/documento-personalidad`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

  return expedienteGuardado;

};