// seguimientoService.js
import axios from 'axios';

const API_BASE = 'http://localhost:8081/SIGCQAL_dev/api/v1';

// --- SEGUIMIENTO MEMORÁNDUM ---
export const guardarSeguimientoMemo = async (data) => {
    // Coincide con SeguimientoMemorandumService.guardar
    return await axios.post(`${API_BASE}/seguimiento-memorandum/guardar`, data);
};

export const listarSeguimientosMemo = async () => {
    // Coincide con SeguimientoMemorandumService.listarTodos
    const res = await axios.get(`${API_BASE}/seguimiento-memorandum/listar`);
    return res.data;
};

// --- SEGUIMIENTO CORRESPONDENCIA ---
export const guardarSeguimientoCorr = async (data) => {
    // Coincide con SeguimientoCorrespondenciaService.guardar
    return await axios.post(`${API_BASE}/seguimiento-correspondencia/guardar`, data);
};

export const listarSeguimientosCorr = async () => {
    // Coincide con SeguimientoCorrespondenciaService.listarTodos
    const res = await axios.get(`${API_BASE}/seguimiento-correspondencia/listar`);
    return res.data;
};

// --- SEGUIMIENTO OFICIO ---
export const listarSeguimientosOficio = async () => {
    const res = await axios.get(`${API_BASE}/seguimiento-oficio/listar`);
    return res.data;
};

export const obtenerBitacoraCompletaMemo = async (idMemo) => {

   // Primero obtenemos el memo para saber el idCorrespondencia
  const memo = await axios.get(`${API_BASE}/memorandums/${idMemo}`)
    .then(r => r.data).catch(() => null);

  // Con el idCorrespondencia del memo, cargamos todo en paralelo
  const [correspondencia, acuses, seguimientos] = await Promise.all([
    memo?.idCorrespondencia
      ? axios.get(`${API_BASE}/correspondencias/entrada/${memo.idCorrespondencia}`)
          .then(r => r.data).catch(() => null)
      : Promise.resolve(null),
    axios.get(`${API_BASE}/acuse-interno/memorandum/${idMemo}`)
      .then(r => r.data).catch(() => []),
    axios.get(`${API_BASE}/seguimiento-memorandum/memorandum/${idMemo}`)
      .then(r => r.data).catch(() => []),
  ]);

  const eventos = [];

  // 0️⃣ CORRESPONDENCIA RECIBIDA — origen del trámite
  if (correspondencia) {
    eventos.push({
      idLog:       `corr-${correspondencia.id}`,
      estatus:     'CORRESPONDENCIA RECIBIDA',
      fecha:       correspondencia.fechaRecibido || correspondencia.fechaRegistro,
      usuario:     correspondencia.nombreRemitente || correspondencia.dependenciaRemitente || 'Remitente externo',
      descripcion: correspondencia.asunto || '',
      folio:       correspondencia.folioUnico,
    });
  }

  // 1️⃣ MEMORANDUM GENERADO
  if (memo) {
    eventos.push({
      idLog:       `memo-${memo.idMemo}`,
      estatus:     'MEMORANDUM GENERADO',
      fecha:       memo.fechaEmision,
      usuario:     memo.nombreUsuarioEmisor || `Usuario ${memo.idUsuarioEmisor}`,
      descripcion: memo.asuntoCorrespondencia || '',
      folio:       memo.folioUnico,
    });
  }

  // 2️⃣ ASIGNADO
  if (memo?.idArea) {
    eventos.push({
      idLog:       `asignado-${memo.idMemo}`,
      estatus:     'ASIGNADO',
      fecha:       memo.fechaEmision,
      usuario:     memo.nombreUsuarioFirmante || `Usuario ${memo.idUsuarioFirmante}`,
      descripcion: `Memorándum asignado al área: ${memo.nombreArea || `Área ${memo.idArea}`}`,
      folio:       memo.folioUnico,
    });
  }

  // 3️⃣ EN SEGUIMIENTO o REASIGNADO
  (acuses || []).forEach((acuse, i) => {
    eventos.push({
      idLog:       `acuse-${acuse.idAcuse || i}`,
      estatus:     acuse.esDelArea ? 'EN SEGUIMIENTO' : 'REASIGNADO',
      fecha:       acuse.fechaAceptacion,
      usuario:     `Usuario ${acuse.idUsuarioRevisor}`,
      descripcion: acuse.esDelArea
        ? 'El área confirmó recepción en su buzón.'
        : 'Documento enviado a reasignación.',
      folio:       null,
    });
  });

  // 4️⃣ CONTESTADO
  (seguimientos || []).forEach((seg, i) => {
    eventos.push({
      idLog:       `seg-${seg.idSeguimientoMemorandum || i}`,
      estatus:     'CONTESTADO',
      fecha:       seg.fechaResolucion,
      usuario:     `Usuario ${seg.idUsuario}`,
      descripcion: seg.respuestaSeguimientoMemorandum || '',
      folio:       seg.folioRespuesta,
    });
  });

  return eventos.sort((a, b) => {
    const da = a.fecha ? new Date(a.fecha) : new Date(0);
    const db = b.fecha ? new Date(b.fecha) : new Date(0);
    return da - db;
  });

  
};

export const obtenerBitacoraCompletaOficio = async (idOficio) => {

  const oficio = await axios.get(`${API_BASE}/oficios/${idOficio}`)
    .then(r => r.data).catch(() => null);

  const [correspondencia, acuses, seguimientos, oficiosContestacion] = await Promise.all([
    oficio?.idCorrespondencia
      ? axios.get(`${API_BASE}/correspondencias/entrada/${oficio.idCorrespondencia}`)
          .then(r => r.data).catch(() => null)
      : Promise.resolve(null),
    axios.get(`${API_BASE}/acuse-oficio/oficio/${idOficio}`)
      .then(r => r.data).catch(() => []),
    axios.get(`${API_BASE}/seguimiento-oficio/oficio/${idOficio}`)
      .then(r => r.data).catch(() => []),
    // ← nuevo: oficios de contestación vinculados a la misma correspondencia
    oficio?.idCorrespondencia
      ? axios.get(`${API_BASE}/oficios/listar`)
          .then(r => r.data.filter(o =>
            o.idCorrespondencia === oficio.idCorrespondencia &&
            o.id !== idOficio
          )).catch(() => [])
      : Promise.resolve([]),
  ]);

  const eventos = [];
  console.log('>>> eventos antes de ordenar:', eventos.map(e => ({
    estatus: e.estatus,
    fecha: e.fecha
})));

  // 0️⃣ CORRESPONDENCIA RECIBIDA — siempre primero
  if (correspondencia) {
    eventos.push({
      idLog:       `corr-${correspondencia.id}`,
      estatus:     'CORRESPONDENCIA RECIBIDA',
      fecha:       correspondencia.fechaRecibido || correspondencia.fechaOficio || correspondencia.fechaRegistro,
      usuario:     correspondencia.nombreRemitente || correspondencia.dependenciaRemitente || 'Remitente externo',
      descripcion: correspondencia.asunto || '',
      folio:       correspondencia.folioUnico,
    });
  }

  // 1️⃣ OFICIO GENERADO
  if (oficio) {
    eventos.push({
      idLog:       `oficio-${oficio.id}`,
      estatus:     'MEMORANDUM GENERADO',
      fecha:       oficio.fechaEmision,
      usuario:     oficio.nombreUsuarioEmisor || `Usuario ${oficio.idUsuarioEmisor}`,
      descripcion: oficio.asuntoCorrespondencia || oficio.observaciones || '',
      folio:       oficio.folioUnico,
    });
  }

  // 2️⃣ ASIGNADO
  if (oficio?.idArea) {
    eventos.push({
      idLog:       `asignado-${oficio.id}`,
      estatus:     'ASIGNADO',
      fecha:       oficio.fechaEmision,
      usuario:     oficio.nombreUsuarioFirmante || `Usuario ${oficio.idUsuarioFirmante}`,
      descripcion: `Oficio asignado al área: ${oficio.nombreArea || `Área ${oficio.idArea}`}`,
      folio:       oficio.folioUnico,
    });
  }

  // 3️⃣ EN SEGUIMIENTO o REASIGNADO — fix del typo
  (acuses || []).forEach((acuse, i) => {
    eventos.push({
      idLog:       `acuse-${acuse.idAcuseOficio || i}`,
      estatus:     acuse.esDelArea ? 'EN SEGUIMIENTO' : 'REASIGNADO', // ← fix
      fecha:       acuse.fechaAceptacion,
      usuario:     `Usuario ${acuse.idUsuarioRevisor}`,
      descripcion: acuse.esDelArea
        ? 'El área confirmó recepción del oficio.'
        : 'Oficio enviado a reasignación.',
      folio:       null,
    });
  });

  // 4️⃣ CONTESTADO
  (seguimientos || []).forEach((seg, i) => {
    eventos.push({
      idLog:       `seg-${seg.idSeguimientoOficio || i}`,
      estatus:     'CONTESTADO',
      fecha:       seg.fechaResolucion,
      usuario:     `Usuario ${seg.idUsuario}`,
      descripcion: seg.respuestasSeguimientoOficio || '',
      folio:       seg.folioRespuesta,
    });
  });

  // 5️⃣ OFICIO DE CONTESTACIÓN GENERADO ← nuevo
  (oficiosContestacion || []).forEach((oc, i) => {
    eventos.push({
      idLog:       `oficio-contest-${oc.id || i}`,
      estatus:     'OFICIO GENERADO',
      fecha:       oc.fechaEmision,
      usuario:     oc.nombreUsuarioFirmante || `Usuario ${oc.idUsuarioFirmante}`,
      descripcion: `Oficio de contestación generado: ${oc.folioUnico}`,
      folio:       oc.folioUnico,
    });
  });

  console.log('>>> idOficio recibido:', idOficio);
console.log('>>> oficio:', oficio);
console.log('>>> correspondencia:', correspondencia);
console.log('>>> acuses:', acuses);
console.log('>>> seguimientos:', seguimientos);

return eventos.sort((a, b) => {
    if (a.estatus === 'CORRESPONDENCIA RECIBIDA') return -1;
    if (b.estatus === 'CORRESPONDENCIA RECIBIDA') return 1;
    if (a.estatus === 'MEMORANDUM GENERADO' || a.estatus === 'OFICIO GENERADO') return -1;
    if (b.estatus === 'MEMORANDUM GENERADO' || b.estatus === 'OFICIO GENERADO') return 1;
    const da = a.fecha ? new Date(a.fecha) : new Date(8640000000000000);
    const db = b.fecha ? new Date(b.fecha) : new Date(8640000000000000);
    return da - db;
});
};