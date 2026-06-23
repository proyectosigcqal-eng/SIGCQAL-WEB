import React, { useState, useEffect } from 'react';
import { getBitacoraPorQueja } from '../../../features/modulo-area-sustantiva/bitacora-historica-sustantiva/services/bitacorahistoricasustantivaService';
import BitacoraHistoricaSustantivaTimeline from './BitacoraHistoricaSustantivaTimeline';

const BitacoraHistoricaSustantivaModal = ({ idQueja, onClose }) => {
    const [bitacora, setBitacora] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBitacora = async () => {
            try {
                setLoading(true);
                const data = await getBitacoraPorQueja(idQueja);
                setBitacora(data);
            } catch (err) {
                setError('No se pudo cargar la bitácora. Inténtalo más tarde.');
            } finally {
                setLoading(false);
            }
        };

        if (idQueja) fetchBitacora();
    }, [idQueja]);

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}>X</button>
                <h2>Bitácora Histórica del Expediente</h2>

                {loading && <p>Cargando información...</p>}
                
                {error && <p className="error-msg">{error}</p>}

                {!loading && !error && (
                    <BitacoraHistoricaSustantivaTimeline data={bitacora} />
                )}
            </div>
        </div>
    );
};

export default BitacoraHistoricaSustantivaModal;