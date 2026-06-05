import { useState, useMemo } from 'react';
import { formatForBackend } from '@/shared/utils/dateUtils';
import { registrarExpediente } from '../services/registroExpedienteService';

const FE_CAMPOS_OBLIGATORIOS = 'Todos los campos obligatorios deben estar completos.';

export const useRegistroExpediente = () => {
  const hoy = useMemo(() => formatForBackend(new Date()), []);

  const [formData, setFormData] = useState({
    // Control Operativo
    folioGobierno: '',
    fechaSolicitud: hoy,
    idMunicipio: '',
    idAsesorResponsable: '',

    // Datos del Contribuyente
    tipoPersona: 'fisica', // 'fisica' o 'moral'
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    rfc: '',
    rec: '',
    identificacionTipo: '',
    identificacionNumero: '',
    correoElectronico: '',
    telefono: '',
    telefonoFijo: '',
    documentoPersonalidad: '',
    archivoDocumentoPersonalidad: null,
    domicilioFiscal: {
      calle: '',
      numero: '',
      numeroInterior: '',
      colonia: '',
      localidad: '',
      codigoPostal: '',
      estado: ''
    },

    // Representante Legal (Sincronizado con JSX anidado)
    representanteLegal: {
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: ''
    },

    // Solicitante (Sincronizado con JSX anidado)
    solicitante: {
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: ''
    },

    // Clasificación de Atención
    clasificacionAtencion: '', // 'asesoria', 'queja' o 'representacion'
  });

  const [erroresCampo, setErroresCampo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [mostrarModalGuardar, setMostrarModalGuardar] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErroresCampo((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
    setError(null);
  };

  const handleChangeNested = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setErroresCampo((prev) => {
      if (!prev[`${section}.${field}`]) return prev;
      const next = { ...prev };
      delete next[`${section}.${field}`];
      return next;
    });
    setError(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setFormData((prev) => ({
      ...prev,
      archivoDocumentoPersonalidad: file
    }));
    setError(null);
  };

  const handleTipoPersonaChange = (tipo) => {
    setFormData((prev) => ({ ...prev, tipoPersona: tipo }));
  };

  const handleClasificacionChange = (clasificacion) => {
    setFormData((prev) => ({ ...prev, clasificacionAtencion: clasificacion }));
  };

  const validarFormulario = () => {
    const errores = {};

    // Validar Control Operativo
    if (!formData.folioGobierno) errores.folioGobierno = 'El folio de gobierno es obligatorio.';
    if (!formData.fechaSolicitud) errores.fechaSolicitud = 'La fecha de solicitud es obligatoria.';
    if (!formData.idMunicipio) errores.idMunicipio = 'El municipio es obligatorio.';
    if (!formData.idAsesorResponsable) errores.idAsesorResponsable = 'El asesor responsable es obligatorio.';

    // Validar Datos del Contribuyente
    if (formData.tipoPersona === 'fisica') {
      if (!formData.nombre) errores.nombre = 'El nombre es obligatorio.';
      if (!formData.apellidoPaterno) errores.apellidoPaterno = 'El apellido paterno es obligatorio.';
      if (!formData.apellidoMaterno) errores.apellidoMaterno = 'El apellido materno es obligatorio.';
    } else {
      if (!formData.nombre) errores.nombre = 'La razón social es obligatoria.';
    }
    
    if (!formData.identificacionTipo) errores.identificacionTipo = 'El tipo de identificación es obligatorio.';
    if (!formData.identificacionNumero) errores.identificacionNumero = 'El número/folio de identificación es obligatorio.';
    
    // Validar Domicilio Fiscal
    if (!formData.domicilioFiscal.calle) errores['domicilioFiscal.calle'] = 'La calle es obligatoria.';
    if (!formData.domicilioFiscal.numero) errores['domicilioFiscal.numero'] = 'El número es obligatorio.';
    if (!formData.domicilioFiscal.colonia) errores['domicilioFiscal.colonia'] = 'La colonia es obligatoria.';
    if (!formData.domicilioFiscal.localidad) errores['domicilioFiscal.localidad'] = 'La localidad es obligatoria.';

    // Validar Representante Legal (Campos individuales requeridos por el JSX)
    if (!formData.representanteLegal.nombre) errores['representanteLegal.nombre'] = 'El nombre del representante es obligatorio.';
    if (!formData.representanteLegal.apellidoPaterno) errores['representanteLegal.apellidoPaterno'] = 'El apellido paterno es obligatorio.';
    if (!formData.representanteLegal.apellidoMaterno) errores['representanteLegal.apellidoMaterno'] = 'El apellido materno es obligatorio.';

    // Validar Solicitante (Campos individuales requeridos por el JSX)
    if (!formData.solicitante.nombre) errores['solicitante.nombre'] = 'El nombre del solicitante es obligatorio.';
    if (!formData.solicitante.apellidoPaterno) errores['solicitante.apellidoPaterno'] = 'El apellido paterno es obligatorio.';
    if (!formData.solicitante.apellidoMaterno) errores['solicitante.apellidoMaterno'] = 'El apellido materno es obligatorio.';

    // Validar Clasificación de Atención
    if (!formData.clasificacionAtencion) errores.clasificacionAtencion = 'La clasificación de atención es obligatoria.';

    return errores;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errores = validarFormulario();

    if (Object.keys(errores).length > 0) {
      setErroresCampo(errores);
      setError(FE_CAMPOS_OBLIGATORIOS);
      return;
    }

    setMostrarModalGuardar(true);
  };

  const handleConfirmarGuardar = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // 1. Construir el payload estructurado de la dirección para que coincida con DireccionRequestDto.java
      const direccionPayload = {
        calle: formData.domicilioFiscal.calle || null,
        
        // Mapea 'numero' de React a 'numExt' de Java
        numExt: formData.domicilioFiscal.numero ? String(formData.domicilioFiscal.numero) : null,
        
        // Mapea 'numeroInterior' de React a 'numInt' de Java
        numInt: formData.domicilioFiscal.numeroInterior ? String(formData.domicilioFiscal.numeroInterior) : null,
        
        colonia: formData.domicilioFiscal.colonia || null,
        cp: formData.domicilioFiscal.codigoPostal ? String(formData.domicilioFiscal.codigoPostal) : null,
        
        // Convierte el ID del estado seleccionado a un número entero
        idEstado: formData.domicilioFiscal.estado ? parseInt(formData.domicilioFiscal.estado, 10) : null,
        
        // Inyecta el ID del municipio (seleccionado en Control Operativo) a la dirección como un entero
        idMunicipio: formData.idMunicipio ? parseInt(formData.idMunicipio, 10) : null
      };

      // 2. Reensamblar los datos finales listos para enviar al Backend
      const payloadListoParaEnviar = {
        ...formData, // Mantenemos los demás datos raíz (folios, nombres, solicitantes)
        idMunicipio: formData.idMunicipio ? parseInt(formData.idMunicipio, 10) : null,
        idAsesorResponsable: formData.idAsesorResponsable ? parseInt(formData.idAsesorResponsable, 10) : null,
        
        // Sobrescribimos el domicilioFiscal viejo con el payload que sí entiende el DTO de Java
        domicilioFiscal: direccionPayload 
      };

      console.log('Payload corregido y estructurado enviado al servicio:', payloadListoParaEnviar);
      
      // 3. Enviar el objeto corregido
      await registrarExpediente(payloadListoParaEnviar);
      
      setSuccessMessage('Expediente guardado correctamente.');
      setMostrarModalGuardar(false);
    } catch (err) {
      setError(err?.message || 'Error al guardar el expediente. Intenta de nuevo.');
      setMostrarModalGuardar(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelarGuardar = () => {
    setMostrarModalGuardar(false);
  };

  return {
    formData,
    erroresCampo,
    isLoading,
    error,
    successMessage,
    mostrarModalGuardar,
    handleChange,
    handleChangeNested,
    handleTipoPersonaChange,
    handleClasificacionChange,
    handleFileChange,
    handleSubmit,
    handleConfirmarGuardar,
    handleCancelarGuardar
  };
};