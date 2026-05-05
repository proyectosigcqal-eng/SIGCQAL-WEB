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