import axios from 'axios';
import { API_HOST } from '@/shared/config/api';
import { REGISTRO_INFORME_AUTORIDAD_ENDPOINT } from '../constants';

export async function registrarInformeAutoridad({
  folio,
  fechaRecepcion,
  numeroOficioRespuesta,
  fojas,
  archivoPdf,
}) {
  const form = new FormData();
  form.append('fecha_recepcion', fechaRecepcion);
  form.append('numero_oficio_respuesta', numeroOficioRespuesta);
  form.append('fojas', String(fojas));
  form.append('archivo_pdf', archivoPdf);

  const url = `${API_HOST}${REGISTRO_INFORME_AUTORIDAD_ENDPOINT(folio)}`;
  const { data } = await axios.post(url, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

