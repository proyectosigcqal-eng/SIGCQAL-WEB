import { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { ModalConstanciaRemision } from '@/features/modulo-area-sustantiva/atencion-juridica/bandeja/components/ModalConstanciaRemision';
import { useFicha } from '@/features/modulo-area-sustantiva/atencion-juridica/bandeja/hooks/useFicha';
import '@/features/modulo-area-sustantiva/atencion-juridica/bandeja/styles/ficha.css';
import { SemaforoContador } from "@/features/modulo-area-sustantiva/atencion-juridica/prevencion/components/SemaforoPlazo";
import { AsesorAsignado } from '@/features/modulo-area-sustantiva/turnado/components/AsesorAsignado';

const normalizarTexto = (value) => {
  if (value === null || value === undefined) return '';
  return value
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
};

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_dev';

export const DetalleTramiteIrlPage = () => {
  const { folio } = useParams();
  const navigate = useNavigate();

  const {
    detalle,
    cargando,
    error,
    generarConstanciaInternaRemision,
    confirmarGeneracionConstancia,
    puedeGenerarConstancia,
    cargandoPreviewConstancia,
    previewConstancia,
    generandoConstancia,
    errorConstancia,
    textoCalificacionJuridica,
    descargarConstancia,
    constanciaUrl,
  } = useFicha(folio);

  const [toast, setToast] = useState(null);
  const [previewKey, setPreviewKey] = useState(0);
  const [modalAbierta, setModalAbierta] = useState(false);
  const [analisisJuridico, setAnalisisJuridico] = useState('');
  const [determinacion, setDeterminacion] = useState('');

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 5000);
    return () => window.clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    if (!constanciaUrl) return;
    setPreviewKey((v) => v + 1);
  }, [constanciaUrl]);

  const estatusNormalizado = useMemo(
    () => normalizarTexto(detalle?.estatus_actual),
    [detalle?.estatus_actual]
  );

  const resumen = useMemo(() => {
    const folioAsesoria = detalle?.folio_asesoria || '';
    const expedienteQueja = detalle?.folio || folio || '';
    const quejoso = detalle?.contribuyente || '';
    const asunto = detalle?.analisis_legal?.tipo_acto_impuesto || '';
    return { folioAsesoria, expedienteQueja, quejoso, asunto };
  }, [detalle, folio]);

  const tieneConstancia = !!constanciaUrl;
  const iframeSrc = tieneConstancia
    ? `${constanciaUrl}${constanciaUrl.includes('?') ? '&' : '?'}t=${previewKey}`
    : '';

  const mensajeConstancia = useMemo(() => {
    if (errorConstancia) return errorConstancia;
    if (!puedeGenerarConstancia && !tieneConstancia) {
      return 'La vista previa indicará si la generación está bloqueada por estatus, calificación o duplicado.';
    }
    return null;
  }, [errorConstancia, puedeGenerarConstancia, tieneConstancia]);

  const abrirModalConstancia = async () => {
    const r = await generarConstanciaInternaRemision();
    if (r?.ok) {
      setModalAbierta(true);
      return;
    }
    setToast({ tipo: 'error', mensaje: r?.message || 'No fue posible cargar la vista previa.' });
  };

  const cerrarModalConstancia = () => {
    if (generandoConstancia) return;
    setModalAbierta(false);
  };

  const handleConfirmarConstancia = async () => {
    const r = await confirmarGeneracionConstancia({
      analisisJuridico,
      determinacion,
    });

    if (r?.ok) {
      setModalAbierta(false);
      setAnalisisJuridico('');
      setDeterminacion('');
      setToast({ tipo: 'ok', mensaje: r?.message || 'Constancia generada exitosamente.' });
      return;
    }

    setToast({ tipo: 'error', mensaje: r?.message || 'No fue posible generar la constancia.' });
  };

  if (cargando) {
    return (
      <div className="ficha-page ficha-estado-center">
        <div className="ficha-spinner" />
        <p>Cargando expediente...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ficha-page ficha-estado-center">
        <p className="ficha-error">{error}</p>
        <button className="ficha-btn-back" onClick={() => navigate(-1)}>← Regresar</button>
      </div>
    );
  }

  return (
    <div className="ficha-page">
      {toast ? (
        <div className={`ficha-toast ${toast.tipo === 'ok' ? 'ficha-toast--ok' : 'ficha-toast--error'}`}>
          {toast.mensaje}
        </div>
      ) : null}

      <button className="ficha-btn-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} />
        SEGUIMIENTO DE QUEJA
      </button>

      <div className="cir-resumen">
        <div className="cir-resumen-item">
          <div className="cir-label">FOLIO ASESORÍA</div>
          <div className="cir-value-link">{resumen.folioAsesoria || '--'}</div>
        </div>
        <div className="cir-resumen-item">
          <div className="cir-label">EXPEDIENTE QUEJA</div>
          <div className="cir-value">{resumen.expedienteQueja || '--'}</div>
          <div className="cir-sub">Pendiente de generar ARI</div>
        </div>
        <div className="cir-resumen-item">
          <div className="cir-label">QUEJOSO</div>
          <div className="cir-value">{resumen.quejoso || '--'}</div>
        </div>
        <div className="cir-resumen-item">
          <div className="cir-label">ASUNTO</div>
          <div className="cir-value">{resumen.asunto || '--'}</div>
        </div>
      </div>

      <div className="cir-layout">
        <div className="cir-left">
          <div className="cir-card">
            <div className="cir-card-title">EMISIÓN DE CIR</div>
            <div className="cir-card-text">
              La Constancia Interna de Remisión (CIR) se basa en el Art. 41 de los Lineamientos. Este documento formaliza el turno del expediente al área de Quejas.
            </div>

            {tieneConstancia ? (
              <button
                className="cir-btn cir-btn--download"
                onClick={async () => {
                  const r = await descargarConstancia();
                  if (!r?.ok) {
                    setToast({ tipo: 'error', mensaje: r?.message || 'No fue posible descargar la constancia.' });
                  }
                }}
              >
                <Download size={16} />
                DESCARGAR PDF
              </button>
            ) : (
              <button
                className="cir-btn cir-btn--primary"
                disabled={cargandoPreviewConstancia || generandoConstancia}
                onClick={abrirModalConstancia}
              >
                {cargandoPreviewConstancia ? 'CARGANDO VISTA PREVIA...' : 'GENERAR CONSTANCIA (ART. 41)'}
              </button>
            )}

            {!tieneConstancia && mensajeConstancia ? (
              <div className="cir-hint">{mensajeConstancia}</div>
            ) : null}
          </div>

          <div className="cir-card cir-card--estatus">
            <div className="cir-card-title">ESTATUS DEL FLUJO</div>
            <div className="cir-status-row">
              <div className="cir-label">ESTADO ACTUAL</div>
              <div className="cir-status-pill">{detalle?.estatus_actual || '--'}</div>
            </div>
            {textoCalificacionJuridica ? (
              <div className="cir-status-row">
                <div className="cir-label">CALIFICACIÓN</div>
                <div className="cir-value">{textoCalificacionJuridica}</div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="cir-right">
          {tieneConstancia ? (
            <iframe
              key={iframeSrc}
              className="cir-iframe"
              title="Constancia Interna de Remisión"
              src={iframeSrc}
            />
          ) : (
            <div className="cir-placeholder">
              <div className="cir-placeholder-icon" />
              <div className="cir-placeholder-texto">
                PRESIONE “GENERAR CONSTANCIA” PARA PREVISUALIZAR
              </div>
            </div>
          )}

        </div>
      </div>

      <ModalConstanciaRemision
        abierta={modalAbierta}
        onCerrar={cerrarModalConstancia}
        onConfirmar={handleConfirmarConstancia}
        cargandoPreview={cargandoPreviewConstancia}
        generando={generandoConstancia}
        preview={previewConstancia}
        analisisJuridico={analisisJuridico}
        determinacion={determinacion}
        onChangeAnalisisJuridico={setAnalisisJuridico}
        onChangeDeterminacion={setDeterminacion}
        error={errorConstancia}
      />
    </div>
  );
};