import { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useNavigate, useParams } from 'react-router-dom';
import { useCatalogos } from '../../../shared/hooks/useCatalogos';
import { VistaPreviaMemorandum } from '../../../features/modulo-correspondencia/memorandum/components/VistaPreviaMemorandum'; 
import { obtenerMemorandumPorId, finalizarAsignacion } from '../../../features/modulo-correspondencia/memorandum/services/memorandumService';
import '../../../features/modulo-correspondencia/memorandum/styles/asignar-area.css';

export const AsignarAreaPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // 1. Extraemos 'areas' y 'usuarios'
    const { areas, usuarios } = useCatalogos(); 
    
    const [memoData, setMemoData] = useState(null);
    const [areaSeleccionadaId, setAreaSeleccionadaId] = useState('');
    const [areaData, setAreaData] = useState(null); 
    const [fueDescargado, setFueDescargado] = useState(false); 
    const [archivoFirmado, setArchivoFirmado] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const data = await obtenerMemorandumPorId(id);
                setMemoData(data);
            } catch (error) {
                console.error("Error al recuperar el memorándum:", error);
            } finally {
                setCargando(false);
            }
        };
        if (id) cargarDatos();
    }, [id]);

    const handleAreaChange = (e) => {
    const areaId = e.target.value;
    setAreaSeleccionadaId(areaId);

    if (areaId === '') {
        setAreaData(null);
        return;
    }

    const area = areas?.find(a => a.id === Number(areaId));

    if (area) {
        setAreaData(area);
        setMemoData(prev => ({
            ...prev,
            idAreaAsignada: area.id,        // ← Number, no string
            nombreAreaAsignada: area.nombreArea || area.nombre
        }));
    }
};

const handleConfirmarFinalizar = async () => {
    if (!archivoFirmado || !areaData) return;
    try {
        // ✅ Pasas el Number desde areaData.id, no el string del select
        await finalizarAsignacion(id, archivoFirmado, areaData.id);
        alert("Memorándum Asignado y Enviado con Éxito");
       navigate('/correspondencia/lista-memorandums-revision');
    } catch (error) {
        console.error("Error al finalizar:", error);
        alert("Hubo un error al procesar el archivo.");
    }
};
    const handleArchivoChange = (e) => {
        const file = e.target.files[0];
        if (file?.type === 'application/pdf') {
            setArchivoFirmado(file);
        } else {
            alert("Por favor, sube un archivo PDF válido");
        }
    };

 const handleDescargar = async () => {
    try {
        const elemento = document.getElementById('memorandum-pdf-content');
        console.log('elemento encontrado:', elemento);
        if (!elemento) {
            alert("No se encontró el contenido del memorándum.");
            return;
        }

        const canvas = await html2canvas(elemento, {
            scale: 3,
            useCORS: true,
            logging: false,
            onclone: (clonedDoc) => {
                const el = clonedDoc.getElementById('memorandum-pdf-content');
                el.style.letterSpacing = "0.5px";
                el.style.wordSpacing = "2px";
                const parrafos = el.getElementsByTagName('p');
                for (let p of parrafos) {
                    p.style.textAlign = "left";
                    p.style.display = "block";
                }
            }
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'letter');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`MEMO_${memoData?.folioUnico || 'DESC'}.pdf`);

        setFueDescargado(true);
    } catch (error) {
        console.error("Error al generar PDF:", error);
        alert("Error al generar el PDF.");
    }
};
    if (cargando) return <div className="p-5 text-center">Cargando datos...</div>;

    return (
        <div className="asignar-area-container">
            <div className="panel-izquierdo-control">
                <h3 className="premium-title">Finalizar Asignación</h3>
                <p className="text-muted small mb-4">Seleccione el área que dará seguimiento.</p>

                <div className="mb-4">
                    <label className="fw-bold small text-uppercase mb-2" style={{color: 'var(--gold)', letterSpacing: '1px'}}>
                        Área Destino 
                    </label>
                    <select 
                        className="form-select form-select-premium" 
                        onChange={handleAreaChange}
                        value={areaSeleccionadaId}
                    >
                        <option value="">Seleccione el área...</option>
                        {areas?.map(area => (
                            <option key={area.id} value={area.id}>
                                {area.nombreArea || area.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="step-container">
                    <div className={`step-card ${areaData ? 'active' : ''}`}>
                        <div className="step-header">
                            <span className="step-number">1</span>
                            <span className="fw-bold small">GENERAR DOCUMENTO</span>
                        </div>
                        <button 
                            className="btn-premium" 
                            onClick={handleDescargar}
                            disabled={!areaData}
                        >
                            <i className="bi bi-cloud-download me-2"></i> Descargar para Firma
                        </button>
                    </div>

                    <div className={`step-card ${fueDescargado ? 'active' : ''}`} style={{opacity: fueDescargado ? 1 : 0.5}}>
                        <div className="step-header">
                            <span className="step-number">2</span>
                            <span className="fw-bold small">SUBIR ARCHIVO FIRMADO</span>
                        </div>
                        <div className="file-upload-wrapper">
                            <i className="bi bi-file-earmark-arrow-up file-upload-icon"></i>
                            <span className="file-upload-text">
                                {archivoFirmado ? archivoFirmado.name : "Seleccionar PDF firmado..."}
                            </span>
                            <input 
                                type="file" 
                                className="input-file-hidden" 
                                accept=".pdf"
                                onChange={handleArchivoChange}
                                disabled={!fueDescargado} 
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-auto text-center">
                    <button 
                        className="btn-premium solid w-100 py-3 mb-3" 
                        disabled={!archivoFirmado}
                        onClick={handleConfirmarFinalizar}
                    >
                        <i className="bi bi-check2-circle me-2"></i> Confirmar y Enviar
                    </button>
                    <button className="btn-cancelar-link" onClick={() => navigate(-1)}>
                        <i className="bi bi-arrow-left"></i> Cancelar 
                    </button>
                </div>
            </div>

            <div className="panel-derecho-preview">
                <div className="preview-scale-wrapper">
                    {memoData && (
                        <VistaPreviaMemorandum 
                            formData={memoData} 
                            usuarios={usuarios}
                            areaDestino={areaData} 
                            idUsuarioAsignado={null} 
                        />
                    )}
                </div>
            </div>
        </div>
    );
};