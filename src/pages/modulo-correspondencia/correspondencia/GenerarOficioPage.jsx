import { useParams } from 'react-router-dom';

export const GenerarOficioPage = () => {
  const { id } = useParams();
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Generar Oficio</h2>
      <p>Correspondencia ID: {id}</p>
      <p style={{ color: '#64748b' }}>Funcionalidad en desarrollo.</p>
    </div>
  );
};

export default GenerarOficioPage;
