import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCierreExpediente } from '../../../features/modulo-area-sustantiva/notificacion-cierre-y-acuerdo-de-razon/hooks/useCierreExpediente';
import CierreForm from '../../../features/modulo-area-sustantiva/notificacion-cierre-y-acuerdo-de-razon/components/CierreForm';
import ConfirmModal from '../../../features/modulo-area-sustantiva/notificacion-cierre-y-acuerdo-de-razon/components/ConfirmModal';
import ExpedienteStatusHeader from '../../../features/modulo-area-sustantiva/notificacion-cierre-y-acuerdo-de-razon/components/ExpedienteStatusHeader';
import './CierrePage.css';


const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_Prod';

const defaultDatos = {
  folio: 'PRUEBA-001',
  expediente: 'EXP-PRUEBA-001',
  quejoso: 'Nombre del solicitante',
  medioNotificacion: 'Correo Electrónico',
  acuerdoFileName: '',
};


const getStoredUser = () => {
  // AuthContext guarda en sessionStorage con esta clave
  const raw = sessionStorage.getItem('sigcqal_session');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
};

const resolveUserId = (user) => {
  if (!user) return null; // ← no hardcodear 12
  return user.idUsuario ?? user.id ?? user.usuarioId ?? null;

};

const CierrePage = () => {
  const { ejecutarCierre, isLocked, isLoading } = useCierreExpediente();
  const [showModal, setShowModal] = useState(false);
  const [datosDelExpediente, setDatosDelExpediente] = useState(defaultDatos);
  const [selectedFile, setSelectedFile] = useState(null);
  const [idUsuarioCierre, setIdUsuarioCierre] = useState(12);
  const [errorMessage, setErrorMessage] = useState('');
  const { idExpediente } = useParams();


  // Datos reales del expediente cargados desde la API
  const [expediente,     setExpediente]     = useState(null);  // { idExpediente, folioGobierno, quejoso, ... }
  const [cargando,       setCargando]       = useState(false);
  const [errorCarga,     setErrorCarga]     = useState('');

  // Medio de notificación (controlado localmente)
  const [medioNotificacion, setMedioNotificacion] = useState('Correo Electrónico');

  // ── Cargar datos del expediente por folio ──────────────────────────────────
useEffect(() => {
  const storedUser = getStoredUser();
  const id = resolveUserId(storedUser);
  if (id) {
    setIdUsuarioCierre(id);
  } else {
    setErrorMessage('No se encontró sesión de usuario. Por favor inicia sesión nuevamente.');
  }
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
    <div className="cierre-page">
      {isLocked ? (
        <div className="cierre-page-locked">
          <div className="locked-card">
            <div className="locked-icon">🔒</div>
            <div>
              <div className="page-label">EXPEDIENTE CERRADO</div>
              <h1 className="page-title">El expediente fue cerrado y bloqueado</h1>
              <p className="page-description">
                Este expediente se encuentra en estado definitivo y ya no puede ser modificado.
                Si necesitas consultar información adicional, revisa el historial del expediente.
              </p>
            </div>
          </div>
          <ExpedienteStatusHeader />
        </div>
      ) : (
        <>
          <div className="cierre-page-header">
            <div className="page-label">Área sustantiva · Cierre</div>
            <h1 className="page-title">Cerrar expediente con seguridad</h1>
            <p className="page-description">
              Completa los datos de notificación y adjunta el acuerdo de razón para finalizar el proceso de cierre administrativo.
              Una vez confirmado, el expediente quedará bloqueado definitivamente.
            </p>
          </div>

          {!idExpediente && (
            <div className="page-alert warning">
              <strong>Ruta de prueba:</strong> Abre esta página con un <code>idExpediente</code> válido.
              <br />Ejemplo: <code>/area-sustantiva/cierre-test/123</code>
            </div>
          )}

          {errorMessage && (
            <div className="page-alert error">
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
        </>
      )}

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