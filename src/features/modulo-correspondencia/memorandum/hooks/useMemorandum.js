import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generarMemorandum } from '../services/memorandumService';

export const useMemorandum = (correspondencia) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    idCorrespondencia:      '',
    instruccionSeguimiento: '',
    idUsuarioEmisor:        '',
    idUsuarioFirmante:      '',
    idPlantilla:            '',
    idArea:                 '',
    observaciones:          '',
    folioUnico:             `MEMO-${Date.now()}`,
    asuntoCorrespondencia:  '',
  });

  // Cuando llegan los datos de correspondencia, los inyecta en el form
  useEffect(() => {
    if (!correspondencia) return;
    setFormData(prev => ({
      ...prev,
      idCorrespondencia:     correspondencia.id,
      asuntoCorrespondencia: correspondencia.asunto || '',
      folioUnico:            correspondencia.folioUnico || `MEMO-${Date.now()}`,
      idArea:                correspondencia.idArea || '',
    }));
  }, [correspondencia]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue = (name.startsWith('id') && value !== '') ? Number(value) : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultado = await generarMemorandum(formData);
      if (resultado?.id) {
        navigate(`/correspondencia/asignar-area/${resultado.id}`);
      } else {
        console.error('El servidor no devolvió el ID del memorándum');
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar el borrador. Revisa la conexión.');
    }
  };

  return { formData, setFormData, handleChange, handleSubmit };
};