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

  let contribuyenteId;

  // NUEVO: si el contribuyente ya existe (vino de Búsqueda de Contribuyente),
  // saltamos la creación de dirección + persona + contribuyente.
  if (formData.contribuyenteExistente?.idPersona) {
    const { idPersona, idContribuyente } = formData.contribuyenteExistente;

    if (idContribuyente) {
      // La persona ya tiene contribuyente -> lo reutilizamos directo
      contribuyenteId = idContribuyente;
    } else {
      // La persona existe pero aún no tiene registro en contribuyentes -> lo creamos
      const contribuyente = await createContribuyente({ idPersona });
      contribuyenteId = getIdFromResponse(contribuyente, ['id', 'idContribuyente', 'id_contribuyentes']);
      if (!contribuyenteId) {
        throw new Error('No se pudo crear el contribuyente a partir de la persona existente.');
      }
    }
  } else {
    // FLUJO ORIGINAL: crear dirección + persona + contribuyente desde cero

    // 1. Domicilio Fiscal
    const direccionPayload = {
      calle: formData.domicilioFiscal.calle || null,
      numExt: formData.domicilioFiscal.numExt ? String(formData.domicilioFiscal.numExt).trim() : null,
      numInt: formData.domicilioFiscal.numInt ? String(formData.domicilioFiscal.numInt).trim() : null,
      colonia: formData.domicilioFiscal.colonia || null,
      cp: formData.domicilioFiscal.cp ? String(formData.domicilioFiscal.cp).trim() : null,
      idEstado: formData.domicilioFiscal.idEstado
        ? parseNumber(formData.domicilioFiscal.idEstado)
        : (formData.domicilioFiscal.estado ? parseNumber(formData.domicilioFiscal.estado) : null),
      idMunicipio: formData.idMunicipio ? parseNumber(formData.idMunicipio) : null
    };
    console.log("PAYLOAD REAL ENVIADO A CREATE_DIRECCION:", direccionPayload);

    const direccion = await createDireccion(direccionPayload);
    const direccionId = getIdFromResponse(direccion, ['id', 'idDireccion', 'id_direccion']);
    if (!direccionId) {
      throw new Error('No se pudo crear la dirección del contribuyente.');
    }

    // 2. Persona Contribuyente
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
      idDireccion: direccionId,
      idTipoPersona: formData.tipoPersona === 'fisica' ? 1 : 2
    };

    const personaContribuyente = await createPersona(personaContribuyentePayload);
    const personaContribuyenteId = getIdFromResponse(personaContribuyente, ['id', 'idPersona', 'id_persona']);
    if (!personaContribuyenteId) {
      throw new Error('No se pudo crear la persona del contribuyente.');
    }

    // 3. Crear el Contribuyente usando el ID obtenido
    const contribuyente = await createContribuyente({ idPersona: personaContribuyenteId });
    contribuyenteId = getIdFromResponse(contribuyente, ['id', 'idContribuyente', 'id_contribuyentes']);
    if (!contribuyenteId) {
      throw new Error('No se pudo crear el contribuyente.');
    }
  }

  // 4. Persona Solicitante (siempre se crea, independiente del flujo anterior)
  const solicitante = await createPersona({
    nombre: formData.solicitante.nombre,
    apellidoPaterno: formData.solicitante.apellidoPaterno,
    apellidoMaterno: formData.solicitante.apellidoMaterno,
    idDireccion: null,
    idTipoPersona: null,
  });
  const solicitanteId = getIdFromResponse(solicitante, ['id', 'idPersona', 'id_persona']);
  if (!solicitanteId) {
    throw new Error('No se pudo crear la persona del solicitante.');
  }

  // 5. Persona Representante Legal (siempre se crea)
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
    folioGobierno: formData.folioGobierno || null,
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
