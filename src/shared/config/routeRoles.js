// Centralized route → roles mapping for RBAC
export const ROUTE_ROLES = {
  '/correspondencia/nuevo-memorandum': ['Administrador', 'Capturista'],
  '/correspondencia/nuevo-oficio': ['Administrador', 'Capturista'],
  '/correspondencia/registrar': ['Administrador', 'Capturista'],
  '/correspondencia/registradas': ['Administrador', 'Revisor', 'Capturista'],
  '/correspondencia/generar-oficio': ['Administrador', 'Capturista'],
  '/correspondencia/generar-oficio-interno': ['Administrador', 'Capturista'],
  '/correspondencia/generar-oficio-externo': ['Administrador', 'Capturista', 'Revisor'],
  '/correspondencia/contestacion': ['Administrador', 'Revisor'],
  '/correspondencia/contestacion-oficio': ['Administrador', 'Revisor'],
  '/correspondencia/contestacion-correspondencia': ['Administrador', 'Revisor'],
  '/correspondencia/nuevo-oficio-contestacion': ['Administrador', 'Revisor'],
  '/correspondencia/seguimiento': ['Administrador', 'Revisor'],
  '/correspondencia/bandeja': ['Administrador', 'Revisor', 'Capturista'],
  '/correspondencia/pendiente-revision-area': ['Administrador', 'Revisor'],
  '/correspondencia/acuses-correspondencia': ['Administrador', 'Revisor', 'Capturista'],
  '/correspondencia/acuses-oficio-por-area': ['Administrador', 'Revisor'],
  '/correspondencia/asignar-area': ['Administrador', 'Revisor'],
  '/correspondencia/asignar-area-oficio': ['Administrador', 'Revisor'],
  '/correspondencia/bitacora': ['Administrador', 'Revisor'],
  '/correspondencia/lista-memorandums-revision': ['Administrador', 'Revisor'],
  '/correspondencia/lista-oficios-revision': ['Administrador', 'Revisor'],
  '/correspondencia/memorandums-por-area': ['Administrador', 'Revisor'],
  '/correspondencia/oficios-por-area': ['Administrador', 'Revisor'],
  '/atencion-juridica/clasificacion': ['Administrador', 'Abogado', 'Abogado Calificador'],
  '/atencion-juridica/bandeja-tramites-irl': ['Administrador', 'Revisor', 'Capturista'],
  '/atencion-juridica/tramites-irl': ['Administrador', 'Revisor', 'Capturista'],
   '/atencion-juridica/asignacion': ['Administrador', 'Abogado', 'Abogado Calificador'],
  '/atencion-juridica/bandeja':    ['Administrador', 'Abogado', 'Abogado Calificador'],
  '/area-sustantiva/registro-expediente': ['Administrador', 'Abogado', 'Abogado Calificador'],

  '/area-sustantiva/contestacion-autoridad': ['Administrador', 'Abogado', 'Abogado Calificador'],

  '/area-sustantiva/quejas-ari': ['Administrador', 'Abogado', 'Abogado Calificador'],

  '/area-sustantiva/rl-cir': ['Administrador', 'Abogado', 'Abogado Calificador'],
  '/area-sustantiva/queja-rl-cir': ['Administrador', 'Abogado', 'Abogado Calificador'],

};

export default ROUTE_ROLES;
