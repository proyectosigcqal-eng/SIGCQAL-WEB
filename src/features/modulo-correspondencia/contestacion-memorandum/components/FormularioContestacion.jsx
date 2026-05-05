import { useState } from 'react';
import { guardarSeguimientoMemorandum, subirPdfFirmado } from '../services/contestacionService';

export const FormularioContestacion = ({ acuse, onGuardado, onError }) => {
  const [folioRespuesta, setFolioRespuesta] = useState('');
  const [respuesta, setRespuesta]           = useState('');
  const [archivo, setArchivo]               = useState(null);
  const [guardando, setGuardando]           = useState(false);

  const handleArchivoChange = (e) => {
    const file = e.target.files[0];
    if (file?.type === 'application/pdf') {
      setArchivo(file);
    } else {
      onError('Por favor, sube un archivo PDF válido.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!folioRespuesta || !respuesta) {
      onError('El folio y el informe de atención son obligatorios.');
      return;
    }

    setGuardando(true);
    try {
      const payload = {
        idMemo:                         acuse.idMemorandum,
        folioRespuesta,
        respuestaSeguimientoMemorandum: respuesta,
        fechaResolucion:                new Date().toISOString().split('T')[0],
        horaResolucion:                 new Date().toTimeString().split(' ')[0],
        archivoAdjunto:                 archivo?.name ?? null,
        idUsuario:                      1, // TODO: usuario autenticado
        idEstatus:                      2,
      };

      // 1️⃣ Guarda el seguimiento y obtiene el id generado
      const seguimientoGuardado = await guardarSeguimientoMemorandum(payload);

      // 2️⃣ Si hay PDF, lo sube por separado
      if (archivo && seguimientoGuardado?.idSeguimientoMemorandum) {
        await subirPdfFirmado(seguimientoGuardado.idSeguimientoMemorandum, archivo);
      }

      onGuardado();
    } catch (err) {
      onError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form className="contestacion-form" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="fw-bold small text-uppercase">Folio Respuesta</label>
        <input
          type="text"
          className="form-control"
          value={folioRespuesta}
          onChange={(e) => setFolioRespuesta(e.target.value)}
          placeholder="Ej. RESP-2026-001"
        />
      </div>

      <div className="mb-3">
        <label className="fw-bold small text-uppercase">Informe de Atención</label>
        <textarea
          className="form-control"
          rows={5}
          value={respuesta}
          onChange={(e) => setRespuesta(e.target.value)}
          placeholder="Describa las acciones tomadas..."
        />
      </div>

      <div className="upload-box">
  <div className="upload-icon">
    {/* tu ícono SVG o emoji */}
    <span style={{fontSize: 14}}>⬆</span>
  </div>
  <div className="upload-text">
    <label className="fw-bold small text-uppercase">Oficio adjunto (opcional)</label>
    <p>{archivo ? archivo.name : 'Seleccionar archivo'}</p>
    <span>Solo archivos .pdf</span>
  </div>
  <input type="file" accept=".pdf" onChange={handleArchivoChange} />
</div>
{archivo && <p className="upload-success">✓ {archivo.name}</p>}

     <button type="submit" className="btn-enviar" disabled={guardando}>
        {guardando ? 'Guardando...' : 'Enviar Contestación'}
      </button>
    </form>
  );
};