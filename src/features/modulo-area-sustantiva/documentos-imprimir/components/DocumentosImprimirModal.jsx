import React, { useState } from "react";
import { X, FileText, Download, Loader2 } from "lucide-react";
import VistaPreviaDocumentos from "./VistaPreviaDocumentos";
import {
  generarDocumentoAsesoria,
  generarDocumentoRepresentacion,
  generarDocumentoInforme,
} from "../services/documentosImprimirService";

const DocumentosImprimirModal = ({
  isOpen,
  onClose,
  expedienteId,
  tipoDocumento,
}) => {
  const [formData, setFormData] = useState({
    nombreContribuyente: "",
    documentacionRemite: "",
    motivosRemite: "",
    fundamentos: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerar = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      switch (tipoDocumento) {
        case "ASESORIA":
          await generarDocumentoAsesoria(expedienteId, formData);
          break;
        case "REPRESENTACION":
          await generarDocumentoRepresentacion(expedienteId, formData);
          break;
        case "INFORME":
          await generarDocumentoInforme(expedienteId, formData);
          break;
        default:
          throw new Error("Tipo de documento no soportado");
      }
      onClose();
    } catch (err) {
      setError(
        err.message || "Error al generar el documento. Revisa la consola.",
      );
      console.error("Error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const getTitulo = () => {
    switch (tipoDocumento) {
      case "ASESORIA":
        return "Solicitud de Servicio Asesoría";
      case "REPRESENTACION":
        return "Solicitud de Servicio Representación Legal";
      case "INFORME":
        return "Informe de Terminación";
      default:
        return "Documento";
    }
  };

  const renderFormFields = () => {
    switch (tipoDocumento) {
      case "ASESORIA":
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Documentación Remite
              </label>
              <textarea
                name="documentacionRemite"
                value={formData.documentacionRemite}
                onChange={handleChange}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej. Escritura pública, Comprobante de domicilio, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Motivos Remite
              </label>
              <textarea
                name="motivosRemite"
                value={formData.motivosRemite}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Motivos de la remisión..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Fundamentos Legales
              </label>
              <textarea
                name="fundamentos"
                value={formData.fundamentos}
                onChange={handleChange}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Artículos, leyes, etc."
              />
            </div>
          </>
        );
      case "REPRESENTACION":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Nombre del Quejoso / Solicitante
            </label>
            <input
              type="text"
              name="nombreContribuyente"
              value={formData.nombreContribuyente}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej. Adrián Cortez Velazquez"
            />
            <p className="text-xs text-gray-500 mt-2">
              Este nombre aparecerá en la firma del documento final.
            </p>
          </div>
        );
      case "INFORME":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Nombre del Contribuyente / Quejoso
            </label>
            <input
              type="text"
              name="nombreContribuyente"
              value={formData.nombreContribuyente}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej. Adrián Cortez Velazquez"
            />
            <p className="text-xs text-gray-500 mt-2">
              Nombre que aparecerá como firmante en el informe.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-gray-100 rounded-lg shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center bg-white px-6 py-4 border-b rounded-t-lg">
          <div className="flex items-center gap-3">
            <FileText className="text-blue-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-800">
              {getTitulo()}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body: Split View */}
        <div className="flex flex-1 overflow-hidden">
          {/* Panel Izquierdo: Formulario */}
          <div className="w-1/3 p-6 bg-white border-r overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Campos del Documento
            </h3>
            <div className="space-y-4">{renderFormFields()}</div>
          </div>

          {/* Panel Derecho: Vista Previa */}
          <div className="flex-1 bg-gray-200 overflow-auto">
            <VistaPreviaDocumentos
              tipoDocumento={tipoDocumento}
              formData={formData}
              expedienteId={expedienteId}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center gap-3 bg-white px-6 py-4 border-t rounded-b-lg">
          {error && (
            <span className="text-red-600 text-sm font-medium">{error}</span>
          )}
          <div className="flex gap-2 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleGenerar}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Generando...
                </>
              ) : (
                <>
                  <Download size={18} />
                  Generar y Descargar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentosImprimirModal;
