import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, X } from 'lucide-react';
import { useCatalogosJuridicos } from '@/features/modulo-area-sustantiva/atencion-juridica/clasificacion/hooks/useCatalogosJuridicos';
import { useClasificacion } from '@/features/modulo-area-sustantiva/atencion-juridica/clasificacion/hooks/useClasificacion';
import { useExpediente } from '@/features/modulo-area-sustantiva/atencion-juridica/clasificacion/hooks/useExpediente';
import { ResumenExpediente } from '@/features/modulo-area-sustantiva/atencion-juridica/clasificacion/components/ResumenExpediente';
import { BannerConfirmacionClasificacion } from '@/features/modulo-area-sustantiva/atencion-juridica/clasificacion/components/BannerConfirmacionClasificacion';
import { Toast } from '@/features/modulo-area-sustantiva/atencion-juridica/clasificacion/components/Toast';
import '@/features/modulo-area-sustantiva/atencion-juridica/clasificacion/styles/clasificacion.css';

const ESTATUS_DEFAULT = [
  'ASESORIA EN PROCESO',
  'QUEJAS Y RECLAMACIONES',
  'REPRESENTACION LEGAL',
  'CONCLUIDO',
  'ACUERDO CONCLUSIVO',
  'ACUERDO ANTICIPADO DE PAGO',
];

const TIPOS_ENTRADA_DEFAULT = ['PRESENCIAL', 'CORREO ELECTRONICO', 'TELEFONICO'];

const normalizarTexto = (value) => {
  if (value == null) return '';
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
};

const findById = (items, id) => items.find((item) => String(item.id) === String(id));
const findByNombre = (items, nombre) => items.find((item) => normalizarTexto(item.nombre) === normalizarTexto(nombre));

const getTipoAsesoriaMeta = (nombre) => {
  const normalized = normalizarTexto(nombre);
  if (normalized.includes('simplificada')) {
    return { titulo: 'ASESORIA SIMPLIFICADA', subtitulo: 'Resolucion inmediata' };
  }
  if (normalized.includes('queja')) {
    return { titulo: 'QUEJA ADMINISTRATIVA', subtitulo: 'Procedimiento de defensa' };
  }
  if (normalized.includes('representacion')) {
    return { titulo: 'REPRESENTACION LEGAL', subtitulo: 'Juicio de nulidad / Amparo' };
  }
  return { titulo: String(nombre || '').toUpperCase(), subtitulo: 'Clasificacion juridica' };
};

export const ClasificacionJuridicaPage = () => {
  // 1. Extraemos el folio alfanumérico de la URL (ej. "FOL-2026-0025")
  const { idExpediente: folioUrl } = useParams();

  const {
    autoridadesFiscales,
    tiposActo,
    calificaciones,
    tiposAsesoria,
    estatusDetalleExpediente,
    tiposEntrada,
    cargando: cargandoCatalogos,
    error: errorCatalogos,
  } = useCatalogosJuridicos();

  // 2. Traemos los datos del expediente usando el folio de la URL
  const { expediente, actualizarExpediente } = useExpediente(folioUrl);
  console.log("DATOS DEL EXPEDIENTE:", expediente);

  // 3. Extraemos el ID numérico del objeto expediente (ajusta "id" por "idExpediente" si tu backend lo llama distinto)
  const idNumerico = expediente?.id || expediente?.idExpediente;

  // 4. Le pasamos el ID numérico real al hook de clasificación
  const { confirmarClasificacion, guardando, error } = useClasificacion(idNumerico);

  const [tipoAsesoria, setTipoAsesoria] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [banner, setBanner] = useState(null);

  const [formData, setFormData] = useState({
    estatusExpediente: 'CONCLUIDO',
    idAutoridadFiscal: '',
    idTipoActo: '',
    idCalificacionActo: '',
    monto: '',
    canalEntrada: 'CORREO ELECTRONICO',
    problematica: '',
    asesoriaProporcionada: '',
    analisisLegal: '',
    confirmoAnalisis: false,
  });

  const catalogosBloqueados = cargandoCatalogos || !!errorCatalogos;

  const estatusOpciones = useMemo(
    () => (estatusDetalleExpediente.length > 0 ? estatusDetalleExpediente.map((item) => item.nombre) : ESTATUS_DEFAULT),
    [estatusDetalleExpediente]
  );

  const canalOpciones = useMemo(
    () => (tiposEntrada.length > 0 ? tiposEntrada.map((item) => item.nombre) : TIPOS_ENTRADA_DEFAULT),
    [tiposEntrada]
  );

  const tipoAsesoriaItem = findById(tiposAsesoria, tipoAsesoria);
  const tipoAsesoriaNombre = tipoAsesoriaItem?.nombre;
  const autoridadNombre = findById(autoridadesFiscales, formData.idAutoridadFiscal)?.nombre;
  const tipoActoNombre = findById(tiposActo, formData.idTipoActo)?.nombre;
  const calificacionNombre = findById(calificaciones, formData.idCalificacionActo)?.nombre;

  const formularioCompleto = !!(
    formData.idAutoridadFiscal &&
    formData.idTipoActo &&
    formData.idCalificacionActo &&
    tipoAsesoria &&
    formData.confirmoAnalisis
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectTipoAsesoria = (id) => {
    if (catalogosBloqueados) return;
    setTipoAsesoria(id);
  };

  const handleSelectEstatus = (estatusExpediente) => {
    if (catalogosBloqueados) return;
    setFormData((prev) => ({ ...prev, estatusExpediente }));
  };

  const handleSelectCanal = (canalEntrada) => {
    if (catalogosBloqueados) return;
    setFormData((prev) => ({ ...prev, canalEntrada }));
  };

  const mostrarError = (message) => {
    setToast({ type: 'error', message });
    setBanner({ status: 'error', message });
  };

 const handleConfirmar = async (e) => {
    e.preventDefault();

    // 1. Extraemos el ID justo al hacer clic (Cambia "idExpediente" por el nombre real que viste en el console.log)
    const idRealParaGuardar = expediente?.id || expediente?.idExpediente; 

    // 2. Si sigue sin existir, detenemos todo y avisamos
    if (!idRealParaGuardar) {
      console.error("El objeto expediente es:", expediente);
      mostrarError('No se encontró el ID numérico del expediente. Revisa la consola.');
      return;
    }

    if (catalogosBloqueados) {
      mostrarError(errorCatalogos || 'Espera a que terminen de cargar los catalogos.');
      return;
    }

    if (!formData.confirmoAnalisis) {
      mostrarError('Debes confirmar que realizaste el analisis legal.');
      return;
    }

    const estatusDetalleItem = findByNombre(estatusDetalleExpediente, formData.estatusExpediente);
    const tipoEntradaItem = findByNombre(tiposEntrada, formData.canalEntrada);
    const estatusDetalleId = Number(estatusDetalleItem?.id);
    const tipoEntradaId = Number(tipoEntradaItem?.id);

    if (!Number.isFinite(estatusDetalleId) || estatusDetalleId <= 0) {
      mostrarError('No se pudo determinar el estatus del expediente desde el catalogo.');
      return;
    }

    if (!Number.isFinite(tipoEntradaId) || tipoEntradaId <= 0) {
      mostrarError('No se pudo determinar el canal de entrada desde el catalogo.');
      return;
    }

    // 3. Le pasamos el idRealParaGuardar directamente a la función
    // NOTA: Si tu hook useClasificacion espera el ID dentro de este objeto, asegúrate de agregarlo.
    const result = await confirmarClasificacion({
      idExpediente: idRealParaGuardar, // <-- Agrégalo aquí si tu API lo necesita en el body
      idAutoridadFiscal: Number(formData.idAutoridadFiscal),
      idTipoActo: Number(formData.idTipoActo),
      idCalificacionActo: Number(formData.idCalificacionActo),
      idTipoAsesoria: Number(tipoAsesoria),
      problematica: formData.problematica,
      seguimientoAsesoria: formData.asesoriaProporcionada,
      monto: formData.monto,
      idTipoEntrada: tipoEntradaId,
      nombreTipoEntrada: tipoEntradaItem.nombre,
      idEstatusDetalleExpediente: estatusDetalleId,
      nombreEstatusDetalle: estatusDetalleItem.nombre,
      calificacionActo: calificacionNombre,
      nombreAutoridad: autoridadNombre,
      nombreTipoActo: tipoActoNombre,
    });

    if (result.ok) {
      actualizarExpediente({ estatus: 'Calificado' });
      setModalOpen(false);
      setToast({ type: 'success', message: result.message });
      setBanner({ status: 'success', message: result.message });
    } else {
      mostrarError(result.message);
    }
  };
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
          <h1 className="aj-title">CLASIFICACION DE ATENCION</h1>
          <div className="aj-subtitle">
            Folio {expediente?.folioGobierno || '-'} / {expediente?.nombreContribuyente || '-'} / {expediente?.estatus || '-'}
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
        <div className="aj-card-title">CLASIFICACION DE ATENCION</div>
        <div className="aj-tipo-grid">
          {tiposAsesoria.map((opt) => {
            const meta = getTipoAsesoriaMeta(opt.nombre);
            return (
              <button
                key={opt.id}
                type="button"
                className={`aj-tipo-option ${String(tipoAsesoria) === String(opt.id) ? 'is-selected' : ''}`}
                onClick={() => handleSelectTipoAsesoria(opt.id)}
                disabled={catalogosBloqueados}
              >
                <span className="aj-radio" aria-hidden="true">
                  <span className="aj-radio-dot" />
                </span>
                <span className="aj-tipo-text">
                  <span className="aj-tipo-title">{meta.titulo}</span>
                  <span className="aj-tipo-subtitle">{meta.subtitulo}</span>
                </span>
              </button>
            );
          })}
        </div>
        {cargandoCatalogos && <div className="aj-inline-info">Cargando catalogos juridicos...</div>}
        {errorCatalogos && <div className="aj-inline-error">{errorCatalogos}</div>}
      </section>

      <section className="aj-card aj-card--analisis">
        <div className="aj-analisis-icon">
          <FileText size={22} />
        </div>
        <div className="aj-analisis-content">
          <div className="aj-analisis-title">ANALISIS DE CASO OBLIGATORIO</div>
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
                <span>ANALISIS DE CASO Y COMPROMISO LEGAL</span>
              </div>
              <button type="button" className="aj-icon-btn" onClick={() => setModalOpen(false)} aria-label="Cerrar">
                <X size={18} />
              </button>
            </div>

            <div className="aj-modal-body">
              <div className="aj-section-title">ESTATUS DEL EXPEDIENTE</div>
              <div className="aj-pill-row">
                {estatusOpciones.map((pill) => (
                  <button
                    key={pill}
                    type="button"
                    className={`aj-pill ${normalizarTexto(formData.estatusExpediente) === normalizarTexto(pill) ? 'is-selected' : ''}`}
                    onClick={() => handleSelectEstatus(pill)}
                    disabled={catalogosBloqueados}
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
                    disabled={catalogosBloqueados}
                  >
                    <option value="">Seleccione autoridad...</option>
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
                    disabled={catalogosBloqueados}
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
                  <label className="aj-label">CALIFICACION DEL ACTO</label>
                  <select
                    className="aj-input"
                    name="idCalificacionActo"
                    value={formData.idCalificacionActo}
                    onChange={handleChange}
                    disabled={catalogosBloqueados}
                  >
                    <option value="">Seleccione calificacion...</option>
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

              <div className="aj-section-title">CANAL DE ENTRADA DEL TRAMITE</div>
              <div className="aj-segment">
                {canalOpciones.map((canal) => (
                  <button
                    key={canal}
                    type="button"
                    className={`aj-seg ${normalizarTexto(formData.canalEntrada) === normalizarTexto(canal) ? 'is-selected' : ''}`}
                    onClick={() => handleSelectCanal(canal)}
                    disabled={catalogosBloqueados}
                  >
                    {canal}
                  </button>
                ))}
              </div>

              <div className="aj-form-row aj-form-row--2">
                <div className="aj-field">
                  <label className="aj-label">PROBLEMATICA DETECTADA POR EL CONTRIBUYENTE</label>
                  <textarea
                    className="aj-textarea"
                    name="problematica"
                    value={formData.problematica}
                    onChange={handleChange}
                    placeholder="Describa el problema..."
                  />
                </div>
                <div className="aj-field">
                  <label className="aj-label">SEGUIMIENTO / ASESORIA</label>
                  <textarea
                    className="aj-textarea"
                    name="asesoriaProporcionada"
                    value={formData.asesoriaProporcionada}
                    onChange={handleChange}
                    placeholder="Describa el seguimiento o asesoria brindada..."
                  />
                </div>
              </div>

              <div className="aj-form-row aj-form-row--2">
                <div className="aj-field">
                  <label className="aj-label">ANALISIS LEGAL DETALLADO</label>
                  <textarea
                    className="aj-textarea"
                    name="analisisLegal"
                    value={formData.analisisLegal}
                    onChange={handleChange}
                    placeholder="Ingrese el fundamento legal y analisis tecnico del caso..."
                  />
                </div>
                <div className="aj-field">
                  <label className="aj-label">MARCO NORMATIVO Y COMPROMISO</label>
                  <div className="aj-normativo">
                    <div className="aj-normativo-title">V. DERECHOS DE LA PERSONA CONTRIBUYENTE</div>
                    <div className="aj-normativo-text">
                      Conforme al articulo 3 de la Ley de los Derechos y Defensa del Contribuyente del Estado de Zacatecas y sus Municipios:
                      <br />
                      <br />
                      1. Que la Comision le preste el servicio de Asesoria, Representacion Legal y Defensa de manera gratuita de conformidad con lo previsto en la Ley de los Derechos y Defensa del Contribuyente para el Estado de Zacatecas y sus Municipios, el presente documento y las demas disposiciones que resulten aplicables.
                      <br />
                      <br />
                      2. A recibir un trato digno, respetuoso y no discriminatorio durante la atencion del expediente.
                    </div>
                  </div>
                </div>
              </div>

              <div className="aj-check-row">
                <label className="aj-check">
                  <input
                    type="checkbox"
                    checked={!!formData.confirmoAnalisis}
                    onChange={(e) => setFormData((prev) => ({ ...prev, confirmoAnalisis: e.target.checked }))}
                  />
                  Confirmo que he realizado el analisis legal
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
                disabled={guardando || catalogosBloqueados || !formularioCompleto}
                onClick={handleConfirmar}
              >
                {guardando ? 'CONFIRMANDO...' : 'CONFIRMAR CLASIFICACION'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};