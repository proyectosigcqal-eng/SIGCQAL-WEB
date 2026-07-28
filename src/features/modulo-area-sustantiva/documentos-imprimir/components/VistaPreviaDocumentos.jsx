import React, { useState, useEffect } from "react";
import { generarPreviewCIR } from "../services/documentosImprimirService";

const VistaPreviaDocumentos = ({ tipoDocumento, formData, expedienteId }) => {
  const [previewHTML, setPreviewHTML] = useState(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  useEffect(() => {
    if (tipoDocumento === "ASESORIA" && expedienteId) {
      cargarPreviewCIR();
    }
  }, [tipoDocumento, expedienteId, formData]);

  const cargarPreviewCIR = async () => {
    setIsLoadingPreview(true);
    try {
      const html = await generarPreviewCIR(expedienteId, formData);
      setPreviewHTML(html);
    } catch (error) {
      console.error("Error cargando preview:", error);
      setPreviewHTML('<p style="color: red;">Error al cargar preview</p>');
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const renderAsesoriaPreview = () => {
    if (isLoadingPreview) {
      return <p className="text-center text-gray-500">Cargando preview...</p>;
    }
    if (previewHTML) {
      return (
        <iframe
          title="Preview CIR"
          srcDoc={previewHTML}
          className="w-full h-full border-0"
        />
      );
    }
    return <p className="text-center text-gray-400">Cargando...</p>;
  };

  const renderRepresentacionPreview = () => {
    return (
      <div className="text-sm space-y-3 p-8 text-justify">
        <p className="text-center font-bold">
          SOLICITUD DE SERVICIO REPRESENTACIÓN LEGAL
        </p>
        <hr />
        <p>
          <strong>Comisión Estatal de la Defensa del Contribuyente</strong>
        </p>
        <p>
          Boulevard José López Portillo, número 60, Colonia Dependencias
          Federales, C.P. 98600, Guadalupe, Zacatecas
        </p>
        <p>
          Horario: 09:00 a 16:00 horas de lunes a viernes. Tel. (492) 927 97 03
        </p>

        <hr className="my-4" />

        <p className="font-bold">IX. Leyenda de Confidencialidad.</p>
        <p className="text-xs text-gray-600">
          Los datos personales recabados serán protegidos, incorporados y
          tratados de conformidad con lo dispuesto por la Ley de Transparencia y
          Acceso a la Información Pública del Estado de Zacatecas y demás
          disposiciones aplicables...
        </p>

        <div className="mt-8 text-center">
          <p className="border-b border-black inline-block px-8 pb-1 font-bold">
            {formData.nombreContribuyente ||
              "NOMBRE Y FIRMA DEL QUEJOSO Y/O SOLICITANTE Y/O REPRESENTENTE LEGAL"}
          </p>
        </div>

        <p className="text-center font-bold text-sm mt-4">
          MANIFIESTO QUE HE LEÍDO EL CONTENIDO DEL PRESENTE DOCUMENTO; ASIMISMO,
          QUE LA INFORMACIÓN PROPORCIONADA ES VERDADERA Y QUE ES MI VOLUNTAD
          SOLICITAR LOS SERVICIOS DE LA COMISIÓN ESTATAL DE LA DEFENSA DEL
          CONTRIBUYENTE.
        </p>
      </div>
    );
  };

  const renderInformePreview = () => {
    return (
      <div className="text-sm space-y-4 p-8">
        <p className="text-center font-bold text-lg">
          Dirección General de Representación Legal
        </p>
        <p className="text-center italic text-gray-600">
          "2013, Año de la Lealtad Institucional y Centenario del Ejercito
          Mexicano"
        </p>

        <hr />

        <p className="mt-6">
          Lo anterior se asienta para los efectos legales a que haya lugar.
          Agréguese a los autos del presente expediente. Así lo acordaron y
          firman:
        </p>

        <div className="mt-12 grid grid-cols-2 gap-8">
          <div className="text-center">
            <p className="border-b border-black pb-1 h-12 flex items-end justify-center"></p>
            <p className="font-bold text-xs mt-2">Contribuyente</p>
            <p className="text-xs text-gray-600">
              {formData.nombreContribuyente || "Adrián Cortez Velazquez"}
            </p>
          </div>
          <div className="text-center">
            <p className="border-b border-black pb-1 h-12 flex items-end justify-center"></p>
            <p className="font-bold text-xs mt-2">
              Encargado de la Comisión Estatal
            </p>
            <p className="text-xs">de la Defensa del Contribuyente</p>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="border-b border-black pb-1 inline-block w-1/3 h-8 flex items-end justify-center"></p>
          <p className="font-bold text-xs mt-2">Asesor Jurídico</p>
        </div>

        <p className="text-center text-xs text-gray-500 mt-12">
          FO-RL-ITRL. Informe de terminación del servicio de Representación
          Legal. Versión 1.0
        </p>
      </div>
    );
  };

  return (
    <div className="bg-white h-full flex flex-col overflow-auto">
      {tipoDocumento === "ASESORIA" ? (
        <div className="flex-1">{renderAsesoriaPreview()}</div>
      ) : tipoDocumento === "REPRESENTACION" ? (
        <div className="flex-1 flex justify-center bg-gray-50">
          <div className="w-[850px] aspect-[8.5/11] my-8 bg-white shadow-lg p-8">
            {renderRepresentacionPreview()}
          </div>
        </div>
      ) : tipoDocumento === "INFORME" ? (
        <div className="flex-1 flex justify-center bg-gray-50">
          <div className="w-[850px] aspect-[8.5/11] my-8 bg-white shadow-lg p-8">
            {renderInformePreview()}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default VistaPreviaDocumentos;
