import { Search } from 'lucide-react';
import { useBandejaGestion } from '@/features/modulo-area-sustantiva/atencion-juridica/bandeja/hooks/useBandejaGestion';
import { TablaTramites } from '@/features/modulo-area-sustantiva/atencion-juridica/bandeja/components/TablaTramites';
import '@/features/modulo-area-sustantiva/atencion-juridica/bandeja/styles/bandeja-gestion.css';

export const BandejaGestionPage = () => {
  const {
    busqueda,
    setBusqueda,
    etapaActiva,
    setEtapaActiva,
    tramites,
    cargando,
    error,
    ETAPAS,
  } = useBandejaGestion();

  return (
    <div className="bdg-page">
      <div className="bdg-header">
        <div>
          <h1 className="bdg-title">Bandeja de Gestión</h1>
          <p className="bdg-subtitle">Monitoreo de plazos legales y atención ciudadana.</p>
        </div>
      </div>

      <div className="bdg-filtros-card">
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

        <div className="bdg-tabs">
          {ETAPAS.map((tab) => (
            <button
              key={tab.key}
              className={`bdg-tab ${etapaActiva === tab.key ? 'is-active' : ''}`}
              onClick={() => setEtapaActiva(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {cargando ? (
          <div className="bdg-empty">
            <p>Cargando...</p>
          </div>
        ) : error ? (
          <div className="bdg-empty">
            <p>{error}</p>
          </div>
        ) : (
          <TablaTramites tramites={tramites} />
        )}
      </div>
    </div>
  );
};
