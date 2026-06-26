import { useState } from 'react'; // <-- IMPORTANTE: Agregamos useState
import { Search } from 'lucide-react';
import { useBandejaGestion } from '@/features/modulo-area-sustantiva/atencion-juridica/bandeja/hooks/useBandejaGestion';
// ¡NUEVO! Importamos también la constante TIPO_TRAMITE_TABS de la tabla
import { TablaTramites, TIPO_TRAMITE_TABS } from '@/features/modulo-area-sustantiva/atencion-juridica/bandeja/components/TablaTramites';
import '@/features/modulo-area-sustantiva/atencion-juridica/bandeja/styles/bandeja-gestion.css';

export const BandejaGestionPage = () => {
  const {
    busqueda, setBusqueda,
    etapaActiva, setEtapaActiva,
    tramites, cargando, error,
    ETAPAS,
  } = useBandejaGestion();

  // ¡NUEVO! Estado heredado de la tabla para controlar el Triple Switch
  const [tipoActivo, setTipoActivo] = useState('QUEJAS_RECLAMACIONES');

  return (
    <div className="bdg-page">

      <div className="bdg-header">
        <div>
          <h1 className="bdg-title">Bandeja de Gestión</h1>
          <p className="bdg-subtitle">Monitoreo de plazos legales y atención ciudadana.</p>
        </div>
      </div>

      {/* ── ¡NUEVO! TRIPLE SWITCH PUESTO HASTA ARRIBA DEL TODO ── */}
      <div className="bdg-switch-bar" style={{ marginBottom: '16px' }}>
        {TIPO_TRAMITE_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTipoActivo(tab.id)}
            className={`bdg-switch-btn ${tipoActivo === tab.id ? 'is-active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bdg-filtros-card">

        {/* ── Buscador (Ahora queda por debajo del triple switch) ── */}
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

        {/* ── Switch de etapas (Barra gris intermedia) ── */}
       {/* ── Switch de etapas (Barra gris intermedia) ── */}
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
          /* ¡NUEVO! Le pasamos el `tipoActivo` a la tabla como prop */
          <TablaTramites tramites={tramites} tipoActivo={tipoActivo} />
        )}

      </div>
    </div>
  );
};