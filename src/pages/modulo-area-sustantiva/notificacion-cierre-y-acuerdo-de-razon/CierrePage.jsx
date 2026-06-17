import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCierreExpediente } from '../../../features/modulo-area-sustantiva/notificacion-cierre-y-acuerdo-de-razon/hooks/useCierreExpediente';
import CierreForm from '../../../features/modulo-area-sustantiva/notificacion-cierre-y-acuerdo-de-razon/components/CierreForm';
import ConfirmModal from '../../../features/modulo-area-sustantiva/notificacion-cierre-y-acuerdo-de-razon/components/ConfirmModal';
import ExpedienteStatusHeader from '../../../features/modulo-area-sustantiva/notificacion-cierre-y-acuerdo-de-razon/components/ExpedienteStatusHeader';

const defaultDatos = {
  folio: 'PRUEBA-001',
  expediente: 'EXP-PRUEBA-001',
  quejoso: 'Nombre del solicitante',
  medioNotificacion: 'Correo Electrónico',
  acuerdoFileName: '',
};

const getStoredUser = () => {
  const raw = localStorage.getItem('user') || localStorage.getItem('usuario');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
};

const resolveUserId = (user) => {
  if (!user) return 12; // valor de prueba
  return user.id || user.idUsuario || user.usuarioId || 12;
};

const CierrePage = () => {
  const { ejecutarCierre, isLocked, isLoading } = useCierreExpediente();
  const [showModal, setShowModal] = useState(false);
  const [datosDelExpediente, setDatosDelExpediente] = useState(defaultDatos);
  const [selectedFile, setSelectedFile] = useState(null);
  const [idUsuarioCierre, setIdUsuarioCierre] = useState(12);
  const [errorMessage, setErrorMessage] = useState('');
  const { idExpediente } = useParams();

  useEffect(() => {
    const storedUser = getStoredUser();
    setIdUsuarioCierre(resolveUserId(storedUser));
  }, []);

  useEffect(() => {
    if (idExpediente) {
      setDatosDelExpediente((prev) => ({
        ...prev,
        folio: `FOLIO-${idExpediente}`,
        expediente: `EXP-${idExpediente}`,
        quejoso: 'Asesoría de prueba',
      }));
    }
  }, [idExpediente]);

  const handleMedioChange = (event) => {
    setDatosDelExpediente((prev) => ({
      ...prev,
      medioNotificacion: event.target.value,
    }));
  };

  const handleFileChange = (file) => {
    setSelectedFile(file);
    setDatosDelExpediente((prev) => ({
      ...prev,
      acuerdoFileName: file ? file.name : '',
    }));
  };

  const handleConfirmar = async () => {
    if (!idExpediente) {
      setErrorMessage('Debes abrir esta página con un idExpediente válido en la ruta. Ejemplo: /area-sustantiva/cierre-test/123');
      setShowModal(false);
      return;
    }

    const payload = {
      idExpediente: Number(idExpediente),
      medioNotificacion: datosDelExpediente.medioNotificacion === 'Correo Electrónico'
        ? 'CORREO ELECTRONICO'
        : 'TELEFONO / MENSAJERIA',
      rutaArchivoAcuerdo: selectedFile
        ? `/almacen/acuerdos/${selectedFile.name}`
        : `/almacen/acuerdos/EXPEDIENTE_${idExpediente}.pdf`,
      idUsuarioCierre,
    };

    const result = await ejecutarCierre(payload);
    if (result.success) {
      setErrorMessage('');
    } else {
      setErrorMessage('Error al cerrar el expediente. Verifica el idExpediente de prueba y el estado actual del expediente.');
    }
    setShowModal(false);
  };

  return (
    <div className="page-wrapper">
      {isLocked && <ExpedienteStatusHeader />}

      {!idExpediente && (
        <div className="route-warning" style={{ marginBottom: '1rem', padding: '1rem', background: '#fff4e5', border: '1px solid #ffe2a4' }}>
          <strong>Ruta de prueba:</strong> Abre esta página con un `idExpediente` válido.
          <br />Ejemplo: <code>/area-sustantiva/cierre-test/123</code>
        </div>
      )}

      {errorMessage && (
        <div className="error-message" style={{ marginBottom: '1rem', color: '#9d3b3b', background: '#fdecea', padding: '1rem', borderRadius: '4px' }}>
          {errorMessage}
        </div>
      )}
      
      <CierreForm 
        data={datosDelExpediente} 
        disabled={isLocked || !idExpediente} 
        onOpenModal={() => setShowModal(true)} 
        onMedioChange={handleMedioChange}
        onFileChange={handleFileChange}
        isLoading={isLoading}
      />

      {showModal && (
        <ConfirmModal 
          onConfirm={handleConfirmar} 
          onCancel={() => setShowModal(false)} 
        />
      )}
    </div>
  );
};

export default CierrePage;