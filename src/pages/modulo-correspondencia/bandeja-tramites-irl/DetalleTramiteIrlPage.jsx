import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useFicha } from '@/features/modulo-area-sustantiva/atencion-juridica/bandeja/hooks/useFicha';
import { BloqueInformacionGeneral } from '@/features/modulo-area-sustantiva/atencion-juridica/bandeja/components/BloqueInformacionGeneral';
import { BloqueAnalisisLegal } from '@/features/modulo-area-sustantiva/atencion-juridica/bandeja/components/BloqueAnalisisLegal';
import { BloqueLineaTiempo } from '@/features/modulo-area-sustantiva/atencion-juridica/bandeja/components/BloqueLineaTiempo';
import { TarjetaEstatusLateral } from '@/features/modulo-area-sustantiva/atencion-juridica/bandeja/components/TarjetaEstatusLateral';
import '@/features/modulo-area-sustantiva/atencion-juridica/bandeja/styles/ficha.css';
import { SemaforoPlazo } from '@/features/modulo-area-sustantiva/atencion-juridica/prevencion/components/SemaforoPlazo';
import { AsesorAsignado } from '@/features/modulo-area-sustantiva/turnado/components/AsesorAsignado';

export const DetalleTramiteIrlPage = () => {
  const { folio } = useParams();
  const navigate = useNavigate();
  const { detalle, cargando, error, verDocumentos, actualizarExpediente } = useFicha(folio);

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
      <button className="ficha-btn-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} />
        FICHA DEL EXPEDIENTE
      </button>

      <div className="ficha-layout">
        <div className="ficha-main">
          <BloqueInformacionGeneral
            folio={detalle.folio}
            fechaRegistro={detalle.fecha_registro}
            contribuyente={detalle.contribuyente}
          />
          <BloqueAnalisisLegal analisis={detalle.analisis_legal} />
          <BloqueLineaTiempo bitacora={detalle.bitacora} />
          <AsesorAsignado
            folio={detalle.folio}
            nombreAsesor={detalle.nombre_asesor}
            onReasignado={(resultado) => {
              // Actualiza el detalle localmente sin recargar
              actualizarExpediente({ nombre_asesor: resultado.nombre_asesor });
            }}
          />
          {/* El semáforo ya no va aquí */}
        </div>

        <div className="ficha-aside">
          <TarjetaEstatusLateral
            folio={folio} 
            estatusActual={detalle.estatus_actual}
            progresoPorcentaje={detalle.progreso_porcentaje}
            onVerDocumentos={verDocumentos}
          />
        </div>
      </div>
    </div>
  );
};