import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBusquedaContribuyente } from '@/features/modulo-area-sustantiva/busqueda-contribuyente/hooks/useBusquedaContribuyente';
import '@/features/modulo-area-sustantiva/busqueda-contribuyente/styles/busquedaContribuyente.css';
 
export const BusquedaContribuyentePage = () => {
  const navigate = useNavigate();
  const {
    texto,
    resultados,
    isLoading,
    error,
    busquedaRealizada,
    handleChangeTexto,
    handleBuscar,
    handleRegistrarAsesoria,
    handleRegistrarNuevaAsesoria
  } = useBusquedaContribuyente();
 
  const formatNombreCompleto = (item) =>
    [item.nombre, item.apellidoPaterno, item.apellidoMaterno]
      .filter(Boolean)
      .join(' ');
 
  return (
    <div className="busqueda-contribuyente-page-container">
      <div className="page-header-busqueda-contribuyente">
        <button
          type="button"
          className="btn-volver"
          onClick={() => navigate(-1)}
        >
          ← Atrás
        </button>
        <h1 className="page-title-busqueda-contribuyente">Búsqueda de Contribuyente</h1>
        <div style={{ width: 100 }} />
      </div>
 
      <div className="page-content-busqueda-contribuyente">
        <form onSubmit={handleBuscar} className="form-busqueda-contribuyente">
          <input
            type="text"
            placeholder="Buscar por Nombre o RFC..."
            value={texto}
            onChange={handleChangeTexto}
            className="input-busqueda-contribuyente"
          />
          <button type="submit" className="btn-buscar" disabled={isLoading}>
            {isLoading ? 'Buscando...' : 'Buscar'}
          </button>
        </form>
 
        {error && (
          <div className="alerta-error" style={{ marginTop: '1rem' }}>
            {error}
          </div>
        )}
 
        {busquedaRealizada && !isLoading && resultados.length > 0 && (
          <div className="tabla-resultados-wrapper">
            <table className="tabla-resultados-contribuyente">
              <thead>
                <tr>
                  <th>Nombre completo</th>
                  <th>RFC</th>
                  <th>Teléfono</th>
                  <th>Correo</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {resultados.map((item) => (
                  <tr key={item.idPersona}>
                    <td>{formatNombreCompleto(item)}</td>
                    <td>{item.rfc || '—'}</td>
                    <td>{item.telefono || '—'}</td>
                    <td>{item.correo || '—'}</td>
                    <td>
                      <button
                        type="button"
                        className="btn-registrar-asesoria"
                        onClick={() => handleRegistrarAsesoria(item)}
                      >
                        Registrar asesoría
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
 
        {busquedaRealizada && !isLoading && resultados.length === 0 && (
          <div className="sin-resultados-contribuyente">
            <p>No se encontraron coincidencias para "{texto}".</p>
            <button
              type="button"
              className="btn-registrar-nueva-asesoria"
              onClick={handleRegistrarNuevaAsesoria}
            >
              Registrar nueva asesoría
            </button>
          </div>
        )}
      </div>
    </div>
  );
};