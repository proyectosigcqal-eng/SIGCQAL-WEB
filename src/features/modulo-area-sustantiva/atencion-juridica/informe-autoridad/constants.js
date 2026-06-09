export const ESTATUS_OFICIO_ENVIADO = 'OFICIO ENVIADO';

export const PLAZO_INFORME_AUTORIDAD_ENDPOINT = (folio) =>
  `/api/v1/expedientes/${encodeURIComponent(folio)}/plazo-informe-autoridad`;

export const REGISTRO_INFORME_AUTORIDAD_ENDPOINT = (folio) =>
  `/api/v1/expedientes/${encodeURIComponent(folio)}/informe-autoridad`;

