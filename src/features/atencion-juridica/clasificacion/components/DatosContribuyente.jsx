import { useMemo } from 'react';
import { useExpediente } from '@/features/atencion-juridica/clasificacion/hooks/useExpediente';

const pick = (obj, paths) => {
  for (const path of paths) {
    const parts = path.split('.');
    let cur = obj;
    for (const p of parts) cur = cur?.[p];
    if (cur !== undefined && cur !== null && String(cur).trim() !== '') return cur;
  }
  return null;
};

export const DatosContribuyente = ({ idExpediente }) => {
  const { expediente } = useExpediente(idExpediente);

  const view = useMemo(() => {
    if (!expediente) return null;

    const nombreCompleto =
      pick(expediente, ['nombreCompleto']) ||
      pick(expediente, ['nombreContribuyente']) ||
      [pick(expediente, ['nombre']), pick(expediente, ['apellidoPaterno']), pick(expediente, ['apellidoMaterno'])]
        .filter(Boolean)
        .join(' ') ||
      pick(expediente, ['contribuyente.persona.nombreCompleto', 'contribuyente.persona.nombre']);

    return {
      folio:
        pick(expediente, ['folioExpediente', 'folioGobierno', 'folio_gobierno', 'folioUnico', 'folio_unico']) || '—',
      nombre: nombreCompleto || '—',
      rfc: pick(expediente, ['rfc', 'contribuyente.persona.rfc']) || '—',
      curp: pick(expediente, ['curp', 'contribuyente.persona.curp']) || '—',
      domicilio: pick(expediente, ['domicilio', 'direccion', 'contribuyente.persona.direccion']) || '—',
      telefono: pick(expediente, ['telefono', 'contribuyente.persona.telefono']) || '—',
      correo:
        pick(expediente, ['correoElectronico', 'correo', 'email', 'contribuyente.persona.correoElectronico']) || '—',
      fechaRegistro:
        pick(expediente, ['fechaRegistro', 'fecha_registro_sistema', 'fechaApertura', 'fecha_apertura']) || '—',
    };
  }, [expediente]);

  if (!view) return <p>No se encontró el expediente.</p>;

  return (
    <section className="datos-contribuyente-card">
      <h2>Datos del Contribuyente</h2>
      <div className="datos-grid">
        <div>
          <strong>Folio:</strong> {view.folio}
        </div>
        <div>
          <strong>Nombre:</strong> {view.nombre}
        </div>
        <div>
          <strong>RFC:</strong> {view.rfc}
        </div>
        <div>
          <strong>CURP:</strong> {view.curp}
        </div>
        <div>
          <strong>Domicilio:</strong> {view.domicilio}
        </div>
        <div>
          <strong>Teléfono:</strong> {view.telefono}
        </div>
        <div>
          <strong>Correo:</strong> {view.correo}
        </div>
        <div>
          <strong>Fecha registro:</strong> {view.fechaRegistro}
        </div>
      </div>
    </section>
  );
};

