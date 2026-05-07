import { useState, useEffect } from 'react';
import { guardarSeguimientoMemorandum, subirPdfFirmado, obtenerProximoFolio } from '../services/contestacionService'; // ← import agregado

export const FormularioContestacion = ({ acuse, onGuardado, onError }) => {
  const [folioGenerado, setFolioGenerado] = useState(null);
  const [folioPreview, setFolioPreview]   = useState(null); // ← agregado
  const [respuesta, setRespuesta]         = useState('');
  const [archivo, setArchivo]             = useState(null);
  const [guardando, setGuardando]         = useState(false);

  useEffect(() => {
    obtenerProximoFolio()
      .then(folio => setFolioPreview(folio))
      .catch(() => setFolioPreview(null));
  }, []);

  const folioMostrar = folioGenerado ?? folioPreview; // ← agregado

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
    if (!respuesta) {
      onError('El informe de atención es obligatorio.');
      return;
    }
    setGuardando(true);
    try {
      const payload = {
        idMemo:                         acuse.idMemorandum,
        respuestaSeguimientoMemorandum: respuesta,
        fechaResolucion:                new Date().toISOString().split('T')[0],
        horaResolucion:                 new Date().toTimeString().split(' ')[0],
        archivoAdjunto:                 archivo?.name ?? null,
        idUsuario:                      1,
        idEstatus:                      5,
      };

      const seguimientoGuardado = await guardarSeguimientoMemorandum(payload);

      if (archivo && seguimientoGuardado?.idSeguimientoMemorandum) {
        await subirPdfFirmado(seguimientoGuardado.idSeguimientoMemorandum, archivo);
      }

      setFolioGenerado(seguimientoGuardado?.folioFormateado ?? folioPreview);
      onGuardado();
    } catch (err) {
      onError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form className="contestacion-form" onSubmit={handleSubmit}>
      <div className="input-group-custom">
        <label>Folio de Contestación</label>
        <div className="folio-preview-box">
          {folioMostrar ? (
            <>
              <span className="folio-prefix">CM-</span>
              <span className="folio-consecutivo">{folioMostrar.split('-')[1]}</span>
              <span className="folio-prefix">-{new Date().getFullYear()}</span>
              <span className="folio-auto-badge">
                {folioGenerado}
              </span>
            </>
          ) : (
            <span style={{ color: '#a0aec0', fontSize: '0.9rem' }}>Calculando folio...</span>
          )}
        </div>
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
          <span style={{ fontSize: 14 }}>⬆</span>
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