import { useState, useEffect, useCallback } from 'react';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_dev';

export const useGestionAsesores = () => {
  const [asesores, setAsesores]   = useState([]);
  const [cargando, setCargando]   = useState(true);
  const [error,    setError]      = useState(null);
  const [busqueda, setBusqueda]   = useState('');

  const cargar = useCallback(() => {
    setCargando(true);
    fetch(`${API}/catalogos/asesores`)
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => { setAsesores(Array.isArray(data) ? data : []); setError(null); })
      .catch(() => setError('No se pudieron cargar los asesores.'))
      .finally(() => setCargando(false));
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const crearAsesor = async (datos) => {
    const res = await fetch(`${API}/api/v1/admin/asesores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    if (!res.ok) throw new Error('Error al crear asesor');
    await cargar();
  };

  const actualizarAsesor = async (id, datos) => {
    const res = await fetch(`${API}/api/v1/admin/asesores/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    if (!res.ok) throw new Error('Error al actualizar asesor');
    await cargar();
  };

  const darBaja = async (id) => {
    const res = await fetch(`${API}/api/v1/admin/asesores/${id}/baja`, {
      method: 'PATCH',
    });
    if (!res.ok) throw new Error('Error al dar de baja');
    await cargar();
  };

  const asesoresFiltrados = asesores.filter(a => {
    const q = busqueda.toLowerCase();
    return !q
      || a.nombreCompleto?.toLowerCase().includes(q)
      || a.especialidad?.toLowerCase().includes(q);
  });

  return {
    asesores: asesoresFiltrados,
    cargando, error, busqueda, setBusqueda,
    crearAsesor, actualizarAsesor, darBaja,
    recargar: cargar,
  };
};