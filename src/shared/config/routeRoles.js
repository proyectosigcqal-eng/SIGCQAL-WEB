
 export const ROUTE_ROLES = {
  // Correspondencia
  '/correspondencia/registrar':          ['Administrador', 'Administrador Correspondencia', ],
  '/correspondencia/registradas':        ['Administrador', 'Administrador Correspondencia'],
  '/correspondencia/generar-oficio':     ['Administrador', 'Administrador Correspondencia', ],
  '/correspondencia/generar-oficio-interno': ['Administrador', 'Administrador Correspondencia', ],
  '/correspondencia/generar-oficio-externo': ['Administrador', 'Administrador Correspondencia', ],
  '/correspondencia/contestacion':       ['Administrador', 'Administrador Correspondencia', 'Gestor de Correspondencia'],
  '/correspondencia/contestacion-oficio':['Administrador', 'Administrador Correspondencia','Gestor de Correspondencia' ],
  '/correspondencia/contestacion-correspondencia': ['Administrador', 'Administrador Correspondencia', 'Gestor de Correspondencia'],
  '/correspondencia/nuevo-oficio-contestacion':    ['Administrador', 'Administrador Correspondencia','Gestor de Correspondencia' ],
  '/correspondencia/seguimiento':        ['Administrador', 'Administrador Correspondencia', 'Gestor de Correspondencia'],
  '/correspondencia/bandeja':            ['Administrador', 'Administrador Correspondencia', ],
  '/correspondencia/pendiente-revision-area':      ['Administrador','Administrador Correspondencia', 'Gestor de Correspondencia'],
  '/correspondencia/acuses-correspondencia':       ['Administrador', 'Administrador Correspondencia','Gestor de Correspondencia'],
  '/correspondencia/acuses-oficio-por-area':       ['Administrador','Administrador Correspondencia','Gestor de Correspondencia' ],
  '/correspondencia/asignar-area':       ['Administrador', 'Administrador Correspondencia', 'Gestor de Correspondencia'],
  '/correspondencia/asignar-area-oficio':['Administrador', 'Administrador Correspondencia', 'Gestor de Correspondencia'],
  '/correspondencia/bitacora':           ['Administrador', 'Administrador Correspondencia'],
  '/correspondencia/lista-memorandums-revision':   ['Administrador', 'Administrador Correspondencia','Gestor de Correspondencia' ],
  '/correspondencia/lista-oficios-revision':       ['Administrador', 'Administrador Correspondencia','Gestor de Correspondencia'],
  '/correspondencia/memorandums-por-area':         ['Administrador', 'Administrador Correspondencia','Gestor de Correspondencia'],
  '/correspondencia/oficios-por-area':             ['Administrador', 'Administrador Correspondencia','Gestor de Correspondencia'],
  '/correspondencia/nuevo-memorandum':   ['Administrador', 'Administrador Correspondencia', ],
  '/correspondencia/nuevo-oficio':       ['Administrador', 'Administrador Correspondencia', ],

  // Atención Jurídica — Asesor
  '/atencion-juridica/clasificacion':    ['Administrador', 'Asesor'],
  '/atencion-juridica/bandeja-tramites-irl': ['Administrador', 'Asesor'],
  '/atencion-juridica/tramites-irl':     ['Administrador', 'Asesor'],
  '/atencion-juridica/asignacion':       ['Administrador', 'Asesor'],
  '/atencion-juridica/bandeja':          ['Administrador', 'Asesor'],
  '/atencion-juridica/checklist':        ['Administrador', 'Asesor'],
  '/atencion-juridica/contestacion-autoridad': ['Administrador', 'Asesor'],
  '/atencion-juridica/oficio-notificacion':    ['Administrador', 'Asesor'],
  '/atencion-juridica/resolucion-final':       ['Administrador', 'Asesor'],
  '/atencion-juridica/constancia-interna-remision': ['Administrador', 'Asesor'],
  '/atencion-juridica/demanda-amparo':   ['Administrador', 'Asesor'],

  // Área Sustantiva — Asesor
  '/area-sustantiva/busqueda-contribuyente': ['Administrador', 'Asesor'],
  '/area-sustantiva/registro-expediente': ['Administrador', 'Asesor'],
  '/area-sustantiva/quejas-ari':          ['Administrador', 'Asesor'],
 '/area-sustantiva/rl-cir': ['Administrador', 'Asesor'],
  '/area-sustantiva/queja-rl-cir': ['Administrador', 'Asesor'],
  '/area-sustantiva/documentos-imprimir/informe-terminacion': ['Administrador', 'Asesor'],
  'area-sustantiva/documentos-imprimir/amparo-predial': ['Administrador', 'Asesor'],
  'area-sustantiva/documentos-imprimir/carta-compromiso': ['Administrador', 'Asesor'],


  // Admin — solo Administrador
  '/admin/usuarios':  ['Administrador'],
  '/admin/asesores':  ['Administrador'],
 };

export default ROUTE_ROLES;