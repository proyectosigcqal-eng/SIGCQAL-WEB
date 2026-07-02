import axios from 'axios'; // O tu cliente HTTP de preferencia

const API_URL = 'http://localhost:8081/SIGCQAL_Prod/api';

export const cerrarExpediente = async (dataCierre) => {
    try {
        const response = await axios.post(`${API_URL}/notificacion-cierre-acuerdo-razon`, dataCierre, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al cerrar el expediente:', error);
        throw error;
    }
};