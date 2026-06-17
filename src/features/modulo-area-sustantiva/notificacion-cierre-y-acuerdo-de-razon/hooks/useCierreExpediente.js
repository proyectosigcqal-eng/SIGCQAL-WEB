import { useState } from 'react';
import { cerrarExpediente } from '../services/cierreService';

export const useCierreExpediente = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isLocked, setIsLocked] = useState(false);

    const ejecutarCierre = async (payload) => {
        setIsLoading(true);
        try {
            await cerrarExpediente(payload);
            setIsLocked(true); // Esto bloqueará la vista cuando el backend responda OK
            return { success: true };
        } catch (error) {
            return { success: false, error };
        } finally {
            setIsLoading(false);
        }
    };

    return { ejecutarCierre, isLoading, isLocked };
};