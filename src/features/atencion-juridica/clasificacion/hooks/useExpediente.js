import { useMemo, useState } from 'react';

const MOCK_EXPEDIENTES = [
  {
    idExpediente: 260100001,
    folioGobierno: '260100001',
    nombreContribuyente: 'Juan Pérez',
    estatus: 'En proceso',
    rfc: 'PEPJ800101XXX',
    curp: 'PEPJ800101HZSRRN09',
    domicilio: 'Calle 1 #123, Centro, Zacatecas',
    telefono: '492 000 0000',
    correoElectronico: 'juan.perez@correo.com',
    fechaRegistro: '2026-05-26',
  },
  {
    idExpediente: 260100002,
    folioGobierno: '260100002',
    nombreContribuyente: 'María López',
    estatus: 'Calificado',
    rfc: 'LOPM900202XXX',
    curp: 'LOPM900202MZSRPR08',
    domicilio: 'Av. Principal #456, Zacatecas',
    telefono: '492 111 1111',
    correoElectronico: 'maria.lopez@correo.com',
    fechaRegistro: '2026-05-25',
  },
];

export const useExpediente = (idExpediente) => {
  const [expedientes, setExpedientes] = useState(MOCK_EXPEDIENTES);

  const expediente = useMemo(() => {
    if (!idExpediente) return null;
    const idNum = Number(idExpediente);
    return expedientes.find((e) => Number(e.idExpediente) === idNum) || null;
  }, [expedientes, idExpediente]);

  const actualizarExpediente = (partial) => {
    if (!idExpediente) return;
    const idNum = Number(idExpediente);
    setExpedientes((prev) =>
      prev.map((e) => (Number(e.idExpediente) === idNum ? { ...e, ...partial } : e))
    );
  };

  return { expediente, expedientes, actualizarExpediente };
};

