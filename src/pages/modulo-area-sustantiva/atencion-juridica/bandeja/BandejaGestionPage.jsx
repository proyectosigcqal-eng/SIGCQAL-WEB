import { Search, SlidersHorizontal } from 'lucide-react';
import { useBandejaGestion } from '@/features/modulo-area-sustantiva/atencion-juridica/bandeja/hooks/useBandejaGestion';
import { useFicha } from '@/features/modulo-area-sustantiva/atencion-juridica/bandeja/hooks/useFicha';
import { TablaTramites } from '@/features/modulo-area-sustantiva/atencion-juridica/bandeja/components/TablaTramites';
import '@/features/modulo-area-sustantiva/atencion-juridica/bandeja/styles/bandeja-gestion.css';
import '@/features/modulo-area-sustantiva/atencion-juridica/bandeja/styles/modales.css';

export const BandejaGestionPage = () => {
  const {
    busqueda,
    setBusqueda,
    estatusSeleccionado,
    setEstatusSeleccionado,
    tabActiva,
    setTabActiva,
    tramitesFiltrados,
    handleFiltrar,
    ESTATUS_OPTIONS,
    TABS,
  } = useBandejaGestion();


  const {
    abierta: fichaAbierta,
    ficha,
    nuevoMensaje,
    setNuevoMensaje,
    abrirFicha,
    cerrarFicha,
    enviarMensaje,
  } = useFicha();

  return (
    <div className="bdg-page">
      {/* ── Encabezado ──────────────────────────────────────────────────── */}
      <div className="bdg-header">
        <div>
          <h1 className="bdg-title">BANDEJA DE GESTIÓN DE TRÁMITES</h1>
          <p className="bdg-subtitle">Listado maestro de expedientes y trazabilidad histórica.</p>
        </div>
        <div className="bdg-sistema">
          <span className="bdg-dot" />
          SISTEMA OPERATIVO
        </div>
      </div>

      {/* ── Filtros ──────────────────────────────────────────────────────── */}
      <div className="bdg-filtros-card">
        <div className="bdg-filtros-row">
          <div className="bdg-search-wrap">
            <Search className="bdg-search-icon" size={16} />
            <input
              type="text"
              className="bdg-search"
              placeholder="Buscar por Folio o Contribuyente..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <select
            className="bdg-select"
            value={estatusSeleccionado}
            onChange={(e) => setEstatusSeleccionado(e.target.value)}
          >
            {ESTATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <button className="bdg-btn-filtrar" onClick={handleFiltrar}>
            <SlidersHorizontal size={15} />
            FILTRAR
          </button>
        </div>

        {/* ── Tabs ──────────────────────────────────────────────────────── */}
        <div className="bdg-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`bdg-tab ${tabActiva === tab.key ? 'is-active' : ''}`}
              onClick={() => setTabActiva(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tabla ─────────────────────────────────────────────────────── */}
        <TablaTramites
          tramites={tramitesFiltrados}
          onFicha={abrirFicha}         // ← abre modal ficha
        />
      </div>
    </div>
  );
};
