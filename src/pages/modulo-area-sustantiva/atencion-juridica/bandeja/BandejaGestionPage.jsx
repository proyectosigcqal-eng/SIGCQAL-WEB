import { useState } from 'react';
import { Search } from 'lucide-react';
import { useBandejaGestion } from '@/features/modulo-area-sustantiva/atencion-juridica/bandeja/hooks/useBandejaGestion';
import { TablaTramites } from '@/features/modulo-area-sustantiva/atencion-juridica/bandeja/components/TablaTramites';
import { RegistroInformeAutoridadModal } from '@/features/modulo-area-sustantiva/atencion-juridica/plazo-autoridad/components/RegistroInformeAutoridadModal';
import '@/features/modulo-area-sustantiva/atencion-juridica/bandeja/styles/bandeja-gestion.css';

export const BandejaGestionPage = () => {
  const {
    busqueda, setBusqueda,
    etapaActiva, setEtapaActiva,
    tramites, cargando, error,
    ETAPAS,
    refrescar,
  } = useBandejaGestion();

  const [modal, setModal] = useState({ open: false, expedienteId: null });

  return (
    <div className="bdg-page">

      <div className="bdg-header">
        <div>
          <h1 className="bdg-title">Bandeja de Gestión</h1>
          <p className="bdg-subtitle">Monitoreo de plazos legales y atención ciudadana.</p>
        </div>
      </div>

      <div className="bdg-filtros-card">

        {/* ── Buscador ── */}
        <div className="bdg-filtros-row">
          <div className="bdg-search-wrap">
            <Search className="bdg-search-icon" size={16} />
            <input
              type="text"
              className="bdg-search"
              placeholder="Buscar por folio, expediente, quejoso o asunto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        {/* ── Switch de etapas ── */}
        <div className="bdg-switch-bar">
          {ETAPAS.map((etapa, i) => (
            <button
              key={etapa.key}
              className={`bdg-switch-btn ${etapaActiva === etapa.key ? 'is-active' : ''}`}
              onClick={() => setEtapaActiva(etapa.key)}
              style={{
                borderRight: i < ETAPAS.length - 1
                  ? '0.5px solid var(--color-border-secondary)'
                  : 'none',
              }}
            >
              {etapa.label}
            </button>
          ))}
        </div>

        {/* ── Contenido ── */}
        {cargando ? (
          <div className="bdg-empty"><p>Cargando...</p></div>
        ) : error ? (
          <div className="bdg-empty"><p>{error}</p></div>
        ) : (
          <TablaTramites tramites={tramites} onInforme={(expedienteId) => setModal({ open: true, expedienteId })} />
        )}

      </div>
      {modal.open && (
        <RegistroInformeAutoridadModal
          expedienteId={modal.expedienteId}
          onClose={() => setModal({ open: false, expedienteId: null })}
          onSuccess={() => refrescar?.()}
        />
      )}
    </div>
  );
};