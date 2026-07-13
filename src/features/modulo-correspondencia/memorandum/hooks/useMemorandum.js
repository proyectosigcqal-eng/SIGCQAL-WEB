import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generarMemorandum } from '../services/memorandumService';

export const useMemorandum = (correspondencia, catalogos) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    idCorrespondencia:      '',
    instruccionSeguimiento: '',
    idUsuarioEmisor:        '',
    idUsuarioFirmante:      '',
    idPlantilla:            '',
    idArea:                 '',
    observaciones:          '',
    folioUnico:             '',
    asuntoCorrespondencia:  '',
    // ✅ Folio de gobierno precargado desde correspondencia
    numeroOficio:           '',
  });

  useEffect(() => {
    if (!correspondencia) return;
    console.log('correspondencia completa:', correspondencia); 
    setFormData(prev => ({
      ...prev,
      idCorrespondencia:     correspondencia.id,
      asuntoCorrespondencia: correspondencia.asunto || '',
      folioUnico:            '',          // lo genera el backend
      idArea:                correspondencia.idArea || '',
      // ✅ Se precarga el No. Oficio del gobierno desde la correspondencia
      numeroOficio:          correspondencia.numeroOficio || '',
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
      const now = new Date();

      const firmante   = catalogos?.usuarios?.find(u => u.id === Number(formData.idUsuarioFirmante));
      const emisor     = catalogos?.usuarios?.find(u => u.id === Number(formData.idUsuarioEmisor));
      const areaDestino = catalogos?.areas?.find(a => a.id === Number(formData.idArea));

      const payload = {
        ...formData,
        fechaEmision:     now.toISOString(),
        fecha_emision:    now.toISOString(),
        fechaCreacion:    now.toISOString(),
        horaEmision:      now.toTimeString().slice(0, 8),
        areaDestinatario: areaDestino?.nombre || areaDestino?.nombreArea || '',
        nombreFirmante:   firmante?.usuarioLogin || '',
        areaFirmante:     firmante?.nombreArea || getAreaUsuario(formData.idUsuarioFirmante, catalogos.usuarios) || '',
        nombreEmisor:     emisor?.usuarioLogin || '',
        // Encargado y cargo NO van aquí — se asignan en AsignarAreaPage
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

  const getAreaUsuario = (idUsuario, usuarios) => {
    const u = usuarios?.find(u => u.id === Number(idUsuario));
    return u?.nombreArea || '';
  };

  return { formData, setFormData, handleChange, handleSubmit };
};
