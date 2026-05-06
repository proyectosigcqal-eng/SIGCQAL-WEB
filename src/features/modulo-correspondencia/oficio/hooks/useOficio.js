import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generarOficio } from '../services/oficioService';

export const useOficio = (correspondencia) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    idCorrespondencia:      '',
    instruccionSeguimiento: '',
    idUsuarioEmisor:        '',
    idUsuarioFirmante:      '',
    idPlantilla:            '',
    idArea:                 '',
    observaciones:          '',
    folioUnico:             `OFICIO-${Date.now()}`,
    asuntoCorrespondencia:  '',
  });

  useEffect(() => {
    if (!correspondencia) return;
    setFormData(prev => ({
      ...prev,
      idCorrespondencia:     correspondencia.id,
      asuntoCorrespondencia: correspondencia.asunto || '',
      folioUnico:            correspondencia.folioUnico || `OFICIO-${Date.now()}`,
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
      const resultado = await generarOficio(formData);
      if (resultado?.id) {
        navigate(`/correspondencia/asignar-area-oficio/${resultado.id}`);
      } else {
        console.error('El servidor no devolvió el ID del oficio');
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar el borrador. Revisa la conexión.');
    }
  };

  return { formData, setFormData, handleChange, handleSubmit };
};
