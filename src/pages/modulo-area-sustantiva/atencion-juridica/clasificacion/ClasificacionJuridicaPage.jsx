import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, X } from 'lucide-react';
import { useCatalogosJuridicos } from '@/features/modulo-area-sustantiva/atencion-juridica/clasificacion/hooks/useCatalogosJuridicos';
import { useClasificacion } from '@/features/modulo-area-sustantiva/atencion-juridica/clasificacion/hooks/useClasificacion';
import { useExpediente } from '@/features/modulo-area-sustantiva/atencion-juridica/clasificacion/hooks/useExpediente';
import { ResumenExpediente } from '@/features/modulo-area-sustantiva/atencion-juridica/clasificacion/components/ResumenExpediente';
import { BannerConfirmacionClasificacion } from '@/features/modulo-area-sustantiva/atencion-juridica/clasificacion/components/BannerConfirmacionClasificacion';
import { Toast } from '@/features/modulo-area-sustantiva/atencion-juridica/clasificacion/components/Toast';
import { getEstatusDetalleExpediente } from '@/shared/services/catalogosServices';
import '@/features/modulo-area-sustantiva/atencion-juridica/clasificacion/styles/clasificacion.css';

const TIPOS_ASESORIA_VIEW = [
  { id: 1, titulo: 'ASESORÍA SIMPLIFICADA', subtitulo: 'Resolución inmediata', nombre: 'Asesoría Simplificada' },
  { id: 2, titulo: 'QUEJA ADMINISTRATIVA', subtitulo: 'Procedimiento de defensa', nombre: 'Queja Administrativa' },
  { id: 3, titulo: 'REPRESENTACIÓN LEGAL', subtitulo: 'Juicio de nulidad / Amparo', nombre: 'Representación Legal' },
];

const TIPO_ENTRADA_ID_POR_NOMBRE = {
  PRESENCIAL: 1,
  'CORREO ELECTRÓNICO': 2,
  TELEFÓNICO: 3,
};

const normalizarTexto = (value) => {
  if (value == null) return '';
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
};

export const ClasificacionJuridicaPage = () => {
  const { idExpediente } = useParams();

  const {
    autoridadesFiscales,
    tiposActo,
    calificaciones,
    cargando: cargandoCatalogos,
    error: errorCatalogos,
  } = useCatalogosJuridicos();

  const { confirmarClasificacion, guardando, error } = useClasificacion(idExpediente);
  const { expediente, actualizarExpediente } = useExpediente(idExpediente);

  const [tipoAsesoria, setTipoAsesoria] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [banner, setBanner] = useState(null);
  const [estatusDetalleCatalogo, setEstatusDetalleCatalogo] = useState([]);

  const [formData, setFormData] = useState({
    estatusExpediente: 'CONCLUIDO',
    idAutoridadFiscal: '',
    idTipoActo: '',
    idCalificacionActo: '',
    monto: '',
    canalEntrada: 'CORREO ELECTRÓNICO',
    problematica: '',
    asesoriaProporcionada: '',
    analisisLegal: '',
    confirmoAnalisis: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectTipoAsesoria = (id) => {
    setTipoAsesoria(id);
  };

  const handleSelectEstatus = (estatusExpediente) => {
    setFormData((prev) => ({ ...prev, estatusExpediente }));
  };

  const handleSelectCanal = (canalEntrada) => {
    setFormData((prev) => ({ ...prev, canalEntrada }));
  };

  useEffect(() => {
    let alive = true;
    getEstatusDetalleExpediente()
      .then((data) => {
        if (!alive) return;
        setEstatusDetalleCatalogo(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!alive) return;
        setEstatusDetalleCatalogo([]);
      });

    return () => {
      alive = false;
    };
  }, []);

  const handleConfirmar = async (e) => {
    e.preventDefault();
    if (!formData.confirmoAnalisis) {
      const msg = 'Debes confirmar que realizaste el análisis legal.';
      setToast({ type: 'error', message: msg });
      setBanner({
        status: 'error',
        message: msg,
      });
      return;
    }

    let catalogoEstatus = estatusDetalleCatalogo;
    if (!Array.isArray(catalogoEstatus) || catalogoEstatus.length === 0) {
      try {
        const data = await getEstatusDetalleExpediente();
        catalogoEstatus = Array.isArray(data) ? data : [];
        setEstatusDetalleCatalogo(catalogoEstatus);
      } catch {
        catalogoEstatus = [];
      }
    }

    const estatusDetalleItem = catalogoEstatus.find(
      (x) => normalizarTexto(x?.nombre) === normalizarTexto(formData.estatusExpediente)
    );
    const estatusDetalleIdRaw = estatusDetalleItem?.id ?? estatusDetalleItem?.idEstatusDetalleExpediente;
    const estatusDetalleId = Number(estatusDetalleIdRaw);
    if (!Number.isFinite(estatusDetalleId)) {
      const msg = 'No se pudo determinar el estatus del expediente (catálogo).';
      setToast({ type: 'error', message: msg });
      setBanner({ status: 'error', message: msg });
      return;
    }

    const result = await confirmarClasificacion({
      idAutoridadFiscal: Number(formData.idAutoridadFiscal),
      idTipoActo: Number(formData.idTipoActo),
      idCalificacionActo: Number(formData.idCalificacionActo),
      idTipoAsesoria: tipoAsesoria ? Number(tipoAsesoria) : null,
      problematica: formData.problematica,
      seguimientoAsesoria: formData.asesoriaProporcionada,
      monto: formData.monto,
      idTipoEntrada: TIPO_ENTRADA_ID_POR_NOMBRE[formData.canalEntrada] ?? null,
      nombreTipoEntrada: formData.canalEntrada,
      idEstatusDetalleExpediente: estatusDetalleId,
      nombreEstatusDetalle: formData.estatusExpediente,
      calificacionActo: calificacionNombre,
      nombreAutoridad: autoridadNombre,
      nombreTipoActo: tipoActoNombre,
    });

    if (result.ok) {
      actualizarExpediente({ estatus: 'Calificado' });
      setModalOpen(false);
      setToast({ type: 'success', message: result.message });
      setBanner({
        status: 'success',
        message: result.message,
      });
    } else {
      setToast({ type: 'error', message: result.message });
      setBanner({
        status: 'error',
        message: result.message,
      });
    }
  };

  const tipoAsesoriaNombre = TIPOS_ASESORIA_VIEW.find((t) => t.id === tipoAsesoria)?.nombre;
  const autoridadNombre = autoridadesFiscales.find((a) => String(a.id) === String(formData.idAutoridadFiscal))?.nombre;
  const tipoActoNombre = tiposActo.find((t) => String(t.id) === String(formData.idTipoActo))?.nombre;
  const calificacionNombre = calificaciones.find((c) => String(c.id) === String(formData.idCalificacionActo))?.nombre;
  const formularioCompleto = !!(
    formData.idAutoridadFiscal &&
    formData.idTipoActo &&
    formData.idCalificacionActo &&
    tipoAsesoria &&
    formData.confirmoAnalisis
  );

  return (
    <div className="aj-page">
      <Toast visible={!!toast} type={toast?.type} message={toast?.message} onClose={() => setToast(null)} />
      <BannerConfirmacionClasificacion
        status={banner?.status}
        message={banner?.message}
        detalles={
          banner
            ? {
                folioGobierno: expediente?.folioGobierno,
                nombreContribuyente: expediente?.nombreContribuyente,
                tramite: expediente?.nombreTramite,
                tipoAsesoria: tipoAsesoriaNombre,
                tipoActo: tipoActoNombre,
                calificacionActo: calificacionNombre,
              }
            : null
        }
        onCerrar={() => setBanner(null)}
      />
      <div className="aj-header">
        <div className="aj-title-wrap">
          <h1 className="aj-title">CLASIFICACIÓN DE ATENCIÓN</h1>
          <div className="aj-subtitle">
            Folio {expediente?.folioGobierno || '—'} · {expediente?.nombreContribuyente || '—'} ·{' '}
            {expediente?.estatus || '—'}
          </div>
        </div>
      </div>

      <ResumenExpediente
        expediente={expediente}
        tramiteNombre={expediente?.nombreTramite}
        tipoAsesoriaNombre={tipoAsesoriaNombre}
        autoridadNombre={autoridadNombre}
        tipoActoNombre={tipoActoNombre}
        calificacionNombre={calificacionNombre}
        canalEntrada={formData.canalEntrada}
        monto={formData.monto}
      />

      <section className="aj-card aj-card--tipo">
        <div className="aj-card-title">CLASIFICACIÓN DE ATENCIÓN</div>
        <div className="aj-tipo-grid">
          {TIPOS_ASESORIA_VIEW.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`aj-tipo-option ${tipoAsesoria === opt.id ? 'is-selected' : ''}`}
              onClick={() => handleSelectTipoAsesoria(opt.id)}
            >
              <span className="aj-radio" aria-hidden="true">
                <span className="aj-radio-dot" />
              </span>
              <span className="aj-tipo-text">
                <span className="aj-tipo-title">{opt.titulo}</span>
                <span className="aj-tipo-subtitle">{opt.subtitulo}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="aj-card aj-card--analisis">
        <div className="aj-analisis-icon">
          <FileText size={22} />
        </div>
        <div className="aj-analisis-content">
          <div className="aj-analisis-title">ANÁLISIS DE CASO OBLIGATORIO</div>
          <div className="aj-analisis-subtitle">
            Para finalizar el registro, es necesario detallar el asunto legal y confirmar el compromiso del contribuyente.
          </div>
          <button type="button" className="aj-btn aj-btn-primary" onClick={() => setModalOpen(true)}>
            DETALLAR ASUNTO Y COMPROMISO LEGAL
          </button>
          <div className="aj-analisis-status">PENDIENTE DE CALIFICAR</div>
        </div>
      </section>

      {modalOpen && (
        <div className="aj-modal-overlay" role="dialog" aria-modal="true">
          <div className="aj-modal">
            <div className="aj-modal-header">
              <div className="aj-modal-title">
                <FileText size={18} />
                <span>ANÁLISIS DE CASO Y COMPROMISO LEGAL</span>
              </div>
              <button type="button" className="aj-icon-btn" onClick={() => setModalOpen(false)} aria-label="Cerrar">
                <X size={18} />
              </button>
            </div>

            <div className="aj-modal-body">
              <div className="aj-section-title">ESTATUS DEL EXPEDIENTE</div>
              <div className="aj-pill-row">
                {[
                  'ASESORÍA EN PROCESO',
                  'QUEJAS Y RECLAMACIONES',
                  'REPRESENTACIÓN LEGAL',
                  'CONCLUIDO',
                  'ACUERDO CONCLUSIVO',
                  'ACUERDO ANTICIPADO DE PAGO',
                ].map((pill) => (
                  <button
                    key={pill}
                    type="button"
                    className={`aj-pill ${formData.estatusExpediente === pill ? 'is-selected' : ''}`}
                    onClick={() => handleSelectEstatus(pill)}
                  >
                    {pill}
                  </button>
                ))}
              </div>

              <div className="aj-form-row aj-form-row--3">
                <div className="aj-field">
                  <label className="aj-label">AUTORIDAD EMISORA DEL ACTO</label>
                  <select
                    className="aj-input"
                    name="idAutoridadFiscal"
                    value={formData.idAutoridadFiscal}
                    onChange={handleChange}
                    disabled={cargandoCatalogos}
                  >
                    <option value="">Ej: SAT, Finanzas...</option>
                    {autoridadesFiscales.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="aj-field">
                  <label className="aj-label">TIPO DE ACTO / IMPUESTO</label>
                  <select
                    className="aj-input"
                    name="idTipoActo"
                    value={formData.idTipoActo}
                    onChange={handleChange}
                    disabled={cargandoCatalogos}
                  >
                    <option value="">Seleccione acto...</option>
                    {tiposActo.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="aj-field">
                  <label className="aj-label">CALIFICACIÓN DEL ACTO</label>
                  <select
                    className="aj-input"
                    name="idCalificacionActo"
                    value={formData.idCalificacionActo}
                    onChange={handleChange}
                    disabled={cargandoCatalogos}
                  >
                    <option value="">Seleccione calificación...</option>
                    {calificaciones.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="aj-form-row">
                <div className="aj-field">
                  <label className="aj-label">MONTO DEL ACTO (MXN)</label>
                  <div className="aj-money">
                    <span className="aj-money-prefix">$</span>
                    <input className="aj-input aj-input-money" name="monto" value={formData.monto} onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="aj-section-title">CANAL DE ENTRADA DEL TRÁMITE</div>
              <div className="aj-segment">
                {['PRESENCIAL', 'CORREO ELECTRÓNICO', 'TELEFÓNICO'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`aj-seg ${formData.canalEntrada === c ? 'is-selected' : ''}`}
                    onClick={() => handleSelectCanal(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="aj-form-row aj-form-row--2">
                <div className="aj-field">
                  <label className="aj-label">PROBLEMÁTICA DETECTADA POR EL CONTRIBUYENTE</label>
                  <textarea
                    className="aj-textarea"
                    name="problematica"
                    value={formData.problematica}
                    onChange={handleChange}
                    placeholder="Describa el problema..."
                  />
                </div>
                <div className="aj-field">
                  <label className="aj-label">SEGUIMIENTO / ASESORÍA</label>
                  <textarea
                    className="aj-textarea"
                    name="asesoriaProporcionada"
                    value={formData.asesoriaProporcionada}
                    onChange={handleChange}
                    placeholder="Describa el seguimiento o asesoría brindada..."
                  />
                </div>
              </div>

              <div className="aj-form-row aj-form-row--2">
                <div className="aj-field">
                  <label className="aj-label">ANÁLISIS LEGAL DETALLADO</label>
                  <textarea
                    className="aj-textarea"
                    name="analisisLegal"
                    value={formData.analisisLegal}
                    onChange={handleChange}
                    placeholder="Ingrese el fundamento legal y análisis técnico del caso..."
                  />
                </div>
                <div className="aj-field">
                  <label className="aj-label">MARCO NORMATIVO Y COMPROMISO</label>
                  <div className="aj-normativo">
                    <div className="aj-normativo-title">V. DERECHOS DE LA PERSONA CONTRIBUYENTE</div>
                    <div className="aj-normativo-text">
                      Conforme al artículo 3 de la Ley de los Derechos y Defensa del Contribuyente del Estado de Zacatecas y sus Municipios:
                      <br />
                      <br />
                      1. Que la Comisión le preste el servicio de Asesoría, Representación Legal y Defensa de manera gratuita de conformidad con lo previsto en la Ley de los Derechos y Defensa del Contribuyente para el Estado de Zacatecas y sus Municipios, el presente documento y las demás disposiciones que resulten aplicables.
                      <br />
                      <br />
                      2. A recibir un trato digno, respetuoso y no discriminatorio durante la atención del expediente.
                    </div>
                  </div>
                </div>
              </div>

              <div className="aj-check-row">
                <label className="aj-check">
                  <input
                    type="checkbox"
                    checked={!!formData.confirmoAnalisis}
                    onChange={(e) => setFormData((p) => ({ ...p, confirmoAnalisis: e.target.checked }))}
                  />
                  Confirmo que he realizado el análisis legal
                </label>
              </div>

              {errorCatalogos && <div className="aj-inline-error">{errorCatalogos}</div>}
              {error && <div className="aj-inline-error">{error}</div>}
            </div>

            <div className="aj-modal-footer">
              <button type="button" className="aj-btn aj-btn-ghost" onClick={() => setModalOpen(false)}>
                CANCELAR
              </button>
              <button
                type="button"
                className="aj-btn aj-btn-primary"
                disabled={guardando || cargandoCatalogos || !formularioCompleto}
                onClick={(e) => handleConfirmar(e)}
              >
                {guardando ? 'CONFIRMANDO...' : 'CONFIRMAR CLASIFICACIÓN'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

