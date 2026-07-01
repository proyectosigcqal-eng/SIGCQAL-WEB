// pages/modulo-area-sustantiva/comisionado/BandejaComisionadoPage.jsx
import { useState } from "react";
import { useComisionadoIrl } from "@/features/modulo-area-sustantiva/comisionado-irl/hooks/useComisionadoIrl";
import { useBandejaGestion } from "@/features/modulo-area-sustantiva/atencion-juridica/bandeja/hooks/useBandejaGestion";
import { TablaComisionadoIrl } from "@/features/modulo-area-sustantiva/comisionado-irl/components/TablaComisionadoIrl";
import { TablaTramites } from "@/features/modulo-area-sustantiva/atencion-juridica/bandeja/components/TablaTramites";
import { FiltrosBandejaGestion } from "@/features/modulo-area-sustantiva/atencion-juridica/bandeja/components/FiltrosBandejaGestion";

import "@/features/modulo-area-sustantiva/atencion-juridica/bandeja/styles/bandeja-gestion.css";

const VISTA_TABS = [
  { key: "ASESORIA_SIMPLIFICADA", label: "Asesoría Simplificada" },
  { key: "QUEJAS", label: "Quejas y Reclamaciones" },
  { key: "IRL", label: "Representación Legal IRL" },
];

export const BandejaComisionadoPage = () => {
  const [vistaActiva, setVistaActiva] = useState("ASESORIA_SIMPLIFICADA");
  const isAsesoriaSimplificada = vistaActiva === "ASESORIA_SIMPLIFICADA";
  const isQuejas = vistaActiva === "QUEJAS";
  const isIrl = vistaActiva === "IRL";

  // Hooks siempre llamados (reglas de hooks). `enabled` controla el fetch.
  const bandeja = useBandejaGestion({ enabled: isQuejas });
  const irl = useComisionadoIrl({ enabled: isIrl });

  return (
    <div className="bdg-page">
      <div className="bdg-header">
        <div>
          <h1 className="bdg-title">Vista Comisionado</h1>
          <p className="bdg-subtitle">
            Consulta general de trámites sustantiva.
          </p>
        </div>
      </div>

      {/* ── Switch PADRE (3 tabs, estilo arquitecto) ── */}
      <div
        className="bdg-switch-padre"
        role="tablist"
        aria-label="Vistas principales"
      >
        {VISTA_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={vistaActiva === tab.key}
            onClick={() => setVistaActiva(tab.key)}
            className={`bdg-switch-padre-btn ${vistaActiva === tab.key ? "is-active" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Contenido scrolleable ── */}
      <div className="bdg-contenido-scroll">
        {isAsesoriaSimplificada && (
          <div className="bdg-vista-asesoria-simplificada bdg-empty">
            <p>
              <strong>Asesoría Simplificada</strong> — vista del expediente.
            </p>
            <p style={{ opacity: 0.6, fontSize: "0.85rem" }}>
              (Placeholder — cablear el componente de vista literal del
              expediente una vez confirmado por el Team Leader.)
            </p>
          </div>
        )}

        {isQuejas && (
          <div className="bdg-vista-quejas">
            <FiltrosBandejaGestion
              busqueda={bandeja.busqueda}
              setBusqueda={bandeja.setBusqueda}
              etapaActiva={bandeja.etapaActiva}
              setEtapaActiva={bandeja.setEtapaActiva}
              ETAPAS={bandeja.ETAPAS}
              cargando={bandeja.cargando}
            />

            {bandeja.cargando ? (
              <div className="bdg-empty">
                <p>Cargando trámites...</p>
              </div>
            ) : bandeja.error ? (
              <div className="bdg-empty">
                <p style={{ color: "#b91c1c" }}>Error: {bandeja.error}</p>
              </div>
            ) : (
              <TablaTramites
                tramites={bandeja.tramites}
                tipoActivo="QUEJAS_RECLAMACIONES"
              />
            )}
          </div>
        )}

        {isIrl && (
          <TablaComisionadoIrl
            subSwitchActivo={irl.subSwitchActivo}
            setSubSwitchActivo={irl.setSubSwitchActivo}
            estatusActivo={irl.estatusActivo}
            setEstatusActivo={irl.setEstatusActivo}
            asesorSeleccionado={irl.asesorSeleccionado}
            setAsesorSeleccionado={irl.setAsesorSeleccionado}
            asesores={irl.asesores}
            busqueda={irl.busqueda}
            setBusqueda={irl.setBusqueda}
            items={irl.items}
            cargando={irl.cargando}
            error={irl.error}
            SUB_SWITCHES={irl.SUB_SWITCHES}
            ESTATUS_TABS={irl.ESTATUS_TABS}
          />
        )}
      </div>
    </div>
  );
};

export default BandejaComisionadoPage;
