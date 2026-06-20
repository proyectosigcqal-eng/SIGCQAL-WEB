import { useState, useEffect, useCallback } from 'react';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_dev';

export const useGestionUsuarios = () => {
  const [usuarios, setUsuarios]   = useState([]);
  const [roles,    setRoles]      = useState([]);
  const [cargando, setCargando]   = useState(true);
  const [error,    setError]      = useState(null);
  const [busqueda, setBusqueda]   = useState('');

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const [uRes, rRes] = await Promise.all([
        fetch(`${API}/catalogos/usuarios`),
        fetch(`${API}/catalogos/roles`),
      ]);
      setUsuarios(uRes.ok ? await uRes.json() : []);
      setRoles(rRes.ok    ? await rRes.json() : []);
      setError(null);
    } catch {
      setError('No se pudieron cargar los usuarios.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const crearUsuario = async (datos) => {
    const res = await fetch(`${API}/api/v1/admin/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    if (!res.ok) throw new Error('Error al crear usuario');
    await cargar();
  };

  const actualizarRoles = async (idUsuario, idRoles) => {
    const res = await fetch(`${API}/api/v1/admin/usuarios/${idUsuario}/roles`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idRoles }),
    });
    if (!res.ok) throw new Error('Error al actualizar roles');
    await cargar();
  };

  const darBaja = async (idUsuario) => {
    const res = await fetch(`${API}/api/v1/admin/usuarios/${idUsuario}/baja`, {
      method: 'PATCH',
    });
    if (!res.ok) throw new Error('Error al dar de baja');
    await cargar();
  };

  const usuariosFiltrados = usuarios.filter(u => {
    const q = busqueda.toLowerCase();
    return !q
      || u.usuarioLogin?.toLowerCase().includes(q)
      || u.nombreArea?.toLowerCase().includes(q);
  });

  return {
    usuarios: usuariosFiltrados,
    roles, cargando, error, busqueda, setBusqueda,
    crearUsuario, actualizarRoles, darBaja,
    recargar: cargar,
  };
};