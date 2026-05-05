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

export const obtenerBitacoraCompletaMemo = async (idMemo) => {

  const [memo, acuses, seguimientos] = await Promise.all([
    axios.get(`${API_BASE}/memorandums/${idMemo}`)
      .then(r => r.data).catch(() => null),
    axios.get(`${API_BASE}/acuse-interno/memorandum/${idMemo}`)
      .then(r => r.data).catch(() => []),
    axios.get(`${API_BASE}/seguimiento-memorandum/memorandum/${idMemo}`)
      .then(r => r.data).catch(() => []),
  ]);

  const eventos = [];

  // 1️⃣ REGISTRADO
  if (memo) {
    eventos.push({
      idLog:       `memo-${memo.idMemo}`,
      estatus:     'REGISTRADO',
      fecha:       memo.fechaEmision,
      usuario:     `Usuario ${memo.idUsuarioEmisor}`,
      descripcion: memo.instruccionSeguimiento || '',
      folio:       memo.folioUnico,
    });
  }

  // 2️⃣ ASIGNADO
  if (memo?.idArea) {
  eventos.push({
    idLog:       `asignado-${memo.id}`,
    estatus:     'ASIGNADO',
    fecha:       memo.fechaEmision,
    usuario:     memo.nombreUsuarioFirmante || `Usuario ${memo.idUsuarioFirmante}`,
    descripcion: `Memorándum asignado al área: ${memo.nombreArea || `Área ${memo.idArea}`}`,
    folio:       memo.folioUnico,
  });
}

  // 3️⃣ EN SEGUIMIENTO o REASIGNADO — un evento por cada acuse
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

  // 4️⃣ ATENDIDO — una entrada por cada contestación registrada
  (seguimientos || []).forEach((seg, i) => {
    eventos.push({
      idLog:       `seg-${seg.idSeguimientoMemorandum || i}`,
      estatus:     'ATENDIDO',
      fecha:       seg.fechaResolucion,
      usuario:     `Usuario ${seg.idUsuario}`,
      descripcion: seg.respuestaSeguimientoMemorandum || '',
      folio:       seg.folioRespuesta,
    });
  });

  // Orden cronológico
  return eventos.sort((a, b) => {
    const da = a.fecha ? new Date(a.fecha) : new Date(0);
    const db = b.fecha ? new Date(b.fecha) : new Date(0);
    return da - db;
  });
};