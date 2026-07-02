import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCierreExpediente } from '../../../features/modulo-area-sustantiva/notificacion-cierre-y-acuerdo-de-razon/hooks/useCierreExpediente';
import CierreForm from '../../../features/modulo-area-sustantiva/notificacion-cierre-y-acuerdo-de-razon/components/CierreForm';
import ConfirmModal from '../../../features/modulo-area-sustantiva/notificacion-cierre-y-acuerdo-de-razon/components/ConfirmModal';
import ExpedienteStatusHeader from '../../../features/modulo-area-sustantiva/notificacion-cierre-y-acuerdo-de-razon/components/ExpedienteStatusHeader';
import './CierrePage.css';



const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_Prod';


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
  const { folio } = useParams(); // ← renombrado: el parámetro de ruta ES el folio


  const { ejecutarCierre, isLocked, isLoading } = useCierreExpediente();

  const [showModal,      setShowModal]      = useState(false);
  const [errorMessage,   setErrorMessage]   = useState('');
  const [selectedFile,   setSelectedFile]   = useState(null);
  const [idUsuarioCierre, setIdUsuarioCierre] = useState(12);


  // Datos reales del expediente cargados desde la API
  const [expediente,     setExpediente]     = useState(null);  // { idExpediente, folioGobierno, quejoso, ... }
  const [cargando,       setCargando]       = useState(false);
  const [errorCarga,     setErrorCarga]     = useState('');

  // Medio de notificación (controlado localmente)
  const [medioNotificacion, setMedioNotificacion] = useState('Correo Electrónico');


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
    if (!folio) return;

    setCargando(true);
    setErrorCarga('');

    // Ajusta la URL al endpoint de tu backend que devuelve expediente por folio.
    // Ejemplos comunes:
    //   GET /api/v1/expedientes/folio/{folio}
    //   GET /catalogos/expedientes?folio={folio}
fetch(`${API}/api/v1/expedientes/${folio}/detalle-asesoria`)
  .then(r => {
    if (!r.ok) throw new Error(`Error ${r.status}`);
    return r.json();
  })
  .then(data => {
    setExpediente({
      idExpediente:  data.idExpediente ?? data.id_expediente,
      folioGobierno: data.folioGobierno ?? data.folio ?? folio,
      quejoso:       data.nombreContribuyente ?? data.contribuyente ?? data.quejoso ?? '—',
    });
  })
      .catch(e => {
        setErrorCarga('No se pudo cargar la información del expediente: ' + e.message);
      })
      .finally(() => setCargando(false));
  }, [folio]);

  // ── Datos que pasan al CierreForm ──────────────────────────────────────────
  const datosDelExpediente = {
    folio:              expediente ? `FOLIO-${expediente.folioGobierno}` : `FOLIO-${folio ?? ''}`,
    expediente:         expediente ? `EXP-${expediente.folioGobierno}`  : `EXP-${folio ?? ''}`,
    quejoso:            expediente?.quejoso ?? (cargando ? 'Cargando...' : '—'),
    medioNotificacion,
    acuerdoFileName:    selectedFile?.name ?? '',
  };

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleMedioChange  = (e) => setMedioNotificacion(e.target.value);

  const handleFileChange   = (file) => setSelectedFile(file);

  const handleConfirmar = async () => {
    if (!expediente?.idExpediente) {
      setErrorMessage('No se pudo obtener el ID del expediente. Intenta recargar la página.');
      setShowModal(false);
      return;
    }

    const payload = {
      // ★ FIX: se manda el id_expediente numérico real, no el folio
      idExpediente: expediente.idExpediente,
      medioNotificacion: medioNotificacion === 'Correo Electrónico'
        ? 'CORREO ELECTRONICO'
        : 'TELEFONO / MENSAJERIA',
      rutaArchivoAcuerdo: selectedFile
        ? `/almacen/acuerdos/${selectedFile.name}`
        : `/almacen/acuerdos/EXPEDIENTE_${expediente.folioGobierno}.pdf`,
      idUsuarioCierre,
    };

    const result = await ejecutarCierre(payload);
    if (result.success) {
      setErrorMessage('');
    } else {
      setErrorMessage('Error al cerrar el expediente. Verifica el estado actual del expediente.');
    }
    setShowModal(false);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
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
              Completa los datos de notificación y adjunta el acuerdo de razón para finalizar
              el proceso de cierre administrativo. Una vez confirmado, el expediente quedará
              bloqueado definitivamente.
            </p>
          </div>

          {!folio && (
            <div className="page-alert warning">
              <strong>Ruta incorrecta:</strong> Abre esta página con un folio válido.
              <br />Ejemplo: <code>/area-sustantiva/cierre-test/260600026</code>
            </div>
          )}

          {cargando && (
            <div className="page-alert">Cargando datos del expediente...</div>
          )}

          {errorCarga && (
            <div className="page-alert error">{errorCarga}</div>
          )}

          {errorMessage && (
            <div className="page-alert error">{errorMessage}</div>
          )}

          <CierreForm
            data={datosDelExpediente}
            disabled={isLocked || !folio || cargando || !!errorCarga}
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
