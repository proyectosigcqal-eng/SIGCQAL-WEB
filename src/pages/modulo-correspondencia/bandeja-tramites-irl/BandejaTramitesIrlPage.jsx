import { useEffect, useMemo, useRef, useState } from 'react';
import { ExternalLink, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getEstatus } from '@/shared/services/catalogosServices';
import { formatDateTimeDisplay } from '@/shared/utils/dateUtils';
import CicloVidaTramiteModal from '@/features/modulo-correspondencia/bandeja-tramites-irl/components/CicloVidaTramiteModal';
import { listarTramitesBandeja } from '@/features/modulo-correspondencia/bandeja-tramites-irl/services/bandejaTramitesIrlService';
import '@/features/modulo-correspondencia/bandeja-tramites-irl/styles/bandejaTramitesIrl.css';

const TABS = [
  { id: 'ASESORIA_SIMPLIFICADA', label: 'ASESORÍA SIMPLIFICADA' },
  { id: 'QUEJAS_RECLAMACIONES', label: 'QUEJAS Y RECLAMACIONES' },
  { id: 'REPRESENTACION_LEGAL_IRL', label: 'REPRESENTACIÓN LEGAL IRL' },
];

function badgeVariantForStatus(s) {
  const t = String(s?.tipo ?? '').toLowerCase();
  if (t === 'success') return 'irl-badge-success';
  if (t === 'warning') return 'irl-badge-warning';
  if (t === 'danger') return 'irl-badge-danger';
  if (t === 'info') return 'irl-badge-info';
  return 'irl-badge-neutral';
}

export default function BandejaTramitesIrlPage() {
  const navigate = useNavigate();

  const [activeTipoTramite, setActiveTipoTramite] = useState(TABS[0].id);
  const [searchInput, setSearchInput] = useState('');
  const [estatusSeleccionado, setEstatusSeleccionado] = useState('');

  const [estatusOptions, setEstatusOptions] = useState([]);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isCicloVidaOpen, setIsCicloVidaOpen] = useState(false);
  const [folioSeleccionado, setFolioSeleccionado] = useState(null);

  const lastRequestId = useRef(0);

  const statusSelectOptions = useMemo(() => {
    return estatusOptions
      .map((e) => ({
        id: e?.id ?? e?.idEstatus ?? e?.clave ?? e?.value,
        label: e?.nombre ?? e?.descripcion ?? e?.label ?? String(e?.id ?? ''),
      }))
      .filter((x) => x.id !== null && x.id !== undefined && x.label);
  }, [estatusOptions]);

  const loadEstatus = async () => {
    try {
      const data = await getEstatus();
      setEstatusOptions(Array.isArray(data) ? data : []);
    } catch {
      setEstatusOptions([]);
    }
  };

  const loadData = async ({ reason } = {}) => {
    const requestId = ++lastRequestId.current;
    setIsLoading(true);
    setError(null);
    try {
      const res = await listarTramitesBandeja({
        tipoTramite: activeTipoTramite,
        query: searchInput,
        estatusId: estatusSeleccionado,
        reason,
      });
      if (requestId !== lastRequestId.current) return;
      setItems(Array.isArray(res?.items) ? res.items : []);
    } catch {
      if (requestId !== lastRequestId.current) return;
      setItems([]);
      setError('No fue posible cargar la información. Intenta nuevamente.');
    } finally {
      if (requestId !== lastRequestId.current) return;
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEstatus();
  }, []);

  useEffect(() => {
    loadData({ reason: 'tab-change' });
  }, [activeTipoTramite]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadData({ reason: 'debounce-search' });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const handleSearchKeyDown = (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    loadData({ reason: 'enter-search' });
  };

  const handleOpenCicloVida = (folioId) => {
    setFolioSeleccionado(folioId);
    setIsCicloVidaOpen(true);
  };

  const handleOpenFicha = (folioId) => {
    navigate(`/correspondencia/tramites-irl/${encodeURIComponent(folioId)}`);
  };

  return (
    <div className="irl-bandeja-wrapper">
      <div className="irl-bandeja-header">
        <h1 className="irl-bandeja-title">Bandeja de Gestión de Trámites</h1>
        <p className="irl-bandeja-subtitle">Asesorías Simplificadas, Quejas y Representación Legal IRL</p>
      </div>

      <div className="irl-card">
        <div className="irl-filters">
          <input
            className="irl-input"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Buscar por Folio o Contribuyente..."
            aria-label="Buscar por Folio o Contribuyente"
          />

          <select
            className="irl-select"
            value={estatusSeleccionado}
            onChange={(e) => setEstatusSeleccionado(e.target.value)}
            aria-label="Filtro de estatus"
          >
            <option value="">TODOS LOS ESTATUS</option>
            {statusSelectOptions.map((o) => (
              <option key={String(o.id)} value={String(o.id)}>
                {o.label}
              </option>
            ))}
          </select>

          <button type="button" className="irl-btn irl-btn-primary" onClick={() => loadData({ reason: 'filter-click' })} disabled={isLoading}>
            FILTRAR
          </button>
        </div>

        <div className="irl-tabs" role="tablist" aria-label="Tipos de trámite">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className="irl-tab"
              role="tab"
              aria-selected={activeTipoTramite === t.id}
              onClick={() => setActiveTipoTramite(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="irl-table-wrap">
          <div className="irl-table-scroll">
            <table className="irl-table">
              <thead>
                <tr>
                  <th>Folio</th>
                  <th>Contribuyente</th>
                  <th>Estatus</th>
                  <th>Última modificación</th>
                  <th className="irl-th-action irl-action-1 irl-sticky-shadow">Bitácora</th>
                  <th className="irl-th-action irl-sticky-shadow">Ficha</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="irl-state">Cargando información...</div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="irl-state irl-error">
                        <div>{error}</div>
                        <button type="button" className="irl-btn irl-btn-secondary" onClick={() => loadData({ reason: 'retry' })}>
                          Reintentar
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="irl-state">No existen registros que cumplan con los filtros aplicados.</div>
                    </td>
                  </tr>
                ) : (
                  items.map((it) => (
                    <tr key={it.idFolio}>
                      <td>
                        <div className="irl-cell-main">
                          <span className="irl-cell-title">{it.idFolio}</span>
                          <span className="irl-cell-subtitle">{it.municipio || '-'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="irl-cell-main">
                          <span className="irl-cell-title">{it.contribuyente || '-'}</span>
                          <span className="irl-cell-subtitle">{it.impuestoOActo || '-'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="irl-statuses">
                          <span className={`irl-badge ${badgeVariantForStatus(it.estatusPrimario)}`}>{it.estatusPrimario?.nombre || '-'}</span>
                          <span className={`irl-badge ${badgeVariantForStatus(it.estatusSecundario)}`}>{it.estatusSecundario?.nombre || '-'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="irl-cell-main">
                          <span className="irl-cell-title">{it.ultimaModificacion?.usuario || '-'}</span>
                          <span className="irl-cell-subtitle">{formatDateTimeDisplay(it.ultimaModificacion?.fechaHora)}</span>
                        </div>
                      </td>
                      <td className="irl-td-action irl-action-1 irl-sticky-shadow">
                        <button
                          type="button"
                          className="irl-icon-btn"
                          onClick={() => handleOpenCicloVida(it.idFolio)}
                          aria-label={`Abrir bitácora del folio ${it.idFolio}`}
                          title="Bitácora"
                        >
                          <Scale size={18} />
                        </button>
                      </td>
                      <td className="irl-td-action irl-sticky-shadow">
                        <button
                          type="button"
                          className="irl-icon-btn"
                          onClick={() => handleOpenFicha(it.idFolio)}
                          aria-label={`Abrir ficha del folio ${it.idFolio}`}
                          title="Ficha"
                        >
                          <ExternalLink size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CicloVidaTramiteModal
        isOpen={isCicloVidaOpen}
        folioId={folioSeleccionado}
        onClose={() => {
          setIsCicloVidaOpen(false);
          setFolioSeleccionado(null);
        }}
      />
    </div>
  );
}

