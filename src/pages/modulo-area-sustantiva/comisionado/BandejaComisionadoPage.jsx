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
  const quejas = useBandejaGestion({
    enabled: isQuejas,
    tipoTramite: "QUEJAS_Y_RECLAMACIONES",
  });
  const asesoria = useBandejaGestion({
    enabled: isAsesoriaSimplificada,
    tipoTramite: "ASESORIA_SIMPLIFICADA",
  });
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
          <div className="bdg-vista-quejas">
            <FiltrosBandejaGestion
              busqueda={asesoria.busqueda}
              setBusqueda={asesoria.setBusqueda}
              etapaActiva={asesoria.etapaActiva}
              setEtapaActiva={asesoria.setEtapaActiva}
              ETAPAS={asesoria.ETAPAS}
              cargando={asesoria.cargando}
              asesores={asesoria.asesores}
              asesorSeleccionado={asesoria.asesorSeleccionado}
              setAsesorSeleccionado={asesoria.setAsesorSeleccionado}
            />

            {asesoria.cargando ? (
              <div className="bdg-empty">
                <p>Cargando trámites...</p>
              </div>
            ) : asesoria.error ? (
              <div className="bdg-empty">
                <p style={{ color: "#b91c1c" }}>Error: {asesoria.error}</p>
              </div>
            ) : (
              <TablaTramites
                tramites={asesoria.tramites}
                tipoActivo="ASESORIA_SIMPLIFICADA"
              />
            )}
          </div>
        )}

        {isQuejas && (
          <div className="bdg-vista-quejas">
            <FiltrosBandejaGestion
              busqueda={quejas.busqueda}
              setBusqueda={quejas.setBusqueda}
              etapaActiva={quejas.etapaActiva}
              setEtapaActiva={quejas.setEtapaActiva}
              ETAPAS={quejas.ETAPAS}
              cargando={quejas.cargando}
              asesores={quejas.asesores}
              asesorSeleccionado={quejas.asesorSeleccionado}
              setAsesorSeleccionado={quejas.setAsesorSeleccionado}
            />

            {quejas.cargando ? (
              <div className="bdg-empty">
                <p>Cargando trámites...</p>
              </div>
            ) : quejas.error ? (
              <div className="bdg-empty">
                <p style={{ color: "#b91c1c" }}>Error: {quejas.error}</p>
              </div>
            ) : (
              <TablaTramites
                tramites={quejas.tramites}
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
