import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsuarioSesion } from '@/shared/hooks/useUsuarioSesion';
import { generarMemorandum } from '../services/memorandumService';

export const useMemorandum = (correspondencia, catalogos) => {
  const navigate = useNavigate();
  const { idUsuario } = useUsuarioSesion();

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

 useEffect(() => {
  if (!correspondencia) return;
  setFormData(prev => ({
    ...prev,
    idCorrespondencia:     correspondencia.id,
    asuntoCorrespondencia: correspondencia.asunto || '',
    folioUnico:            '',
    idArea:                correspondencia.idArea || '',
  }));
}, [correspondencia]);

  useEffect(() => {
    if (!idUsuario) return;
    setFormData((prev) => {
      if (prev.idUsuarioEmisor) return prev;
      const usuario = catalogos?.usuarios?.find((u) => Number(u.id) === Number(idUsuario));
      return {
        ...prev,
        idUsuarioEmisor: idUsuario,
        idArea: usuario?.idArea ? Number(usuario.idArea) : prev.idArea,
      };
    });
  }, [idUsuario, catalogos?.usuarios]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue = (name.startsWith('id') && value !== '') ? Number(value) : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const now = new Date();
        const firmante = catalogos?.usuarios?.find(
            u => u.id === Number(formData.idUsuarioFirmante)
        );
        const emisor = catalogos?.usuarios?.find(
            u => u.id === Number(formData.idUsuarioEmisor)
        );
        const areaDestino = catalogos?.areas?.find(
            a => a.id === Number(formData.idArea)
        );

        const payload = {
            ...formData,
            fechaEmision:  now.toISOString(),
  fecha_emision: now.toISOString(),
  fechaCreacion: now.toISOString(),
  horaEmision:   now.toTimeString().slice(0, 8), // "HH:MM:SS"
  
  areaDestinatario: areaDestino?.nombre || areaDestino?.nombreArea || '',
  nombreFirmante:   firmante?.usuarioLogin || '',
  areaFirmante:     firmante?.nombreArea || getAreaUsuario(formData.idUsuarioFirmante, catalogos.usuarios) || '',
  nombreEmisor:     emisor?.usuarioLogin || '',
};

        const resultado = await generarMemorandum(payload);
        if (resultado?.id) {
            navigate(`/correspondencia/asignar-area/${resultado.id}`);
        }
    } catch (error) {
        console.error('Error al guardar:', error);
        alert('Error al guardar el borrador.');
    }
};

// Helper para obtener área de un usuario
const getAreaUsuario = (idUsuario, usuarios) => {
    const u = usuarios?.find(u => u.id === Number(idUsuario));
    return u?.nombreArea || '';
};
  return { formData, setFormData, handleChange, handleSubmit }; 
};