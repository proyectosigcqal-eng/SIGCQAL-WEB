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
    <div className="modal-content" style={{
      maxWidth: '600px',      // Ancho máximo
      width: '90%',           // Para móviles
      maxHeight: '80vh',      // ALTURA MÁXIMA (80% de la pantalla)
      overflowY: 'auto',      // Habilita el scroll vertical
      margin: 'auto',
      padding: '20px',
      borderRadius: '12px',
      background: '#fff',
      position: 'relative'
    }}>
      
      {/* Botón de cierre en la esquina superior derecha */}
      <button 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          border: 'none',
          background: '#f1f1f1',
          cursor: 'pointer',
          padding: '5px 10px',
          borderRadius: '50%'
        }}
      >
        X
      </button>

      <h3>Bitácora Histórica del Expediente</h3>

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