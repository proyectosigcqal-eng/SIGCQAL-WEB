import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './shared/MainLayout'; 
import { GenerarMemorandumPage } from './pages/modulo-correspondencia/memorandum/GenerarMemorandumPage';
import { GenerarOficioPage } from './pages/modulo-correspondencia/oficio/GenerarOficioPage';
import { GenerarOficioPage as GenerarOficioCorrespondenciaPage } from './pages/modulo-correspondencia/correspondencia/GenerarOficioPage';
import { GenerarOficioInternoPage } from './pages/modulo-correspondencia/correspondencia/GenerarOficioInternoPage';
import { GenerarOficioExternoPage } from './pages/modulo-correspondencia/correspondencia/GenerarOficioExternoPage';
import { RegistrarCorrespondenciaPage } from './pages/modulo-correspondencia/correspondencia/RegistrarCorrespondenciaPage';
import { CorrespondenciasRegistradasPage } from './pages/modulo-correspondencia/correspondencia/CorrespondenciasRegistradasPage';
import { AsignarAreaPage } from './pages/modulo-correspondencia/memorandum/AsignarAreaPage'; 
import { AsignarAreaOficioPage } from './pages/modulo-correspondencia/oficio/AsignarAreaOficioPage'; 
import { BitacoraHistorica } from './features/modulo-correspondencia/bitacora-historica/components/BitacoraHistorica';
import { ContestacionPage } from './pages/modulo-correspondencia/contestacion-memorandum/ContestacionPage';
import { ContestacionOficioPage } from './pages/modulo-correspondencia/contestacion-oficio/ContestacionOficioPage';
import { BandejaCentralPage } from './pages/modulo-correspondencia/bandeja-central/BandejaCentralPage';
import BandejaTramitesIrlPage from './pages/modulo-correspondencia/bandeja-tramites-irl/BandejaTramitesIrlPage';
import {DetalleTramiteIrlPage} from './pages/modulo-correspondencia/bandeja-tramites-irl/DetalleTramiteIrlPage';
import { ListaMemorandumsPage } from './pages/modulo-correspondencia/memorandum/ListaMemorandumsPage';
import { ListaOficiosPage } from './pages/modulo-correspondencia/oficio/ListaOficiosPage';
import { ListaMemorandumsPorAreaPage } from './pages/modulo-correspondencia/acuserecibointerno/ListaMemorandumsPorAreaPage';
import { ContestacionCorrespondenciaPage } from './pages/modulo-correspondencia/contestacion-correspondencia/ContestacionCorrespondenciaPage';
import { CorrespondenciaPendienteRevisionPage } from './pages/modulo-correspondencia/correspondencia/CorrespondenciaPendienteRevisionPage';
import { ListaAcusesCorrespondenciaPage } from './pages/modulo-correspondencia/acusecorrespondencia/ListaAcusesCorrespondenciaPage';
import { ListaOficiosPorAreaPage } from './pages/modulo-correspondencia/oficio/ListaOficiosPorAreaPage';
import { ListaAcusesOficioPage } from './pages/modulo-correspondencia/acuseoficio/ListaAcusesOficioPage';
import { GenerarOficioContestacionPage } from './pages/modulo-correspondencia/oficio/GenerarOficioContestacionPage';
import { BandejaGestionPage } from './pages/modulo-area-sustantiva/atencion-juridica/bandeja/BandejaGestionPage';
import { ClasificacionJuridicaPage } from './pages/modulo-area-sustantiva/atencion-juridica/clasificacion/ClasificacionJuridicaPage';
import { RegistroExpedientePage } from './pages/modulo-area-sustantiva/registroexpediente/RegistroExpedientePage';
import ProtectedRoute from './shared/components/ProtectedRoute';
import { ROUTE_ROLES } from './shared/config/routeRoles';
import AccesoRestringidoPage from './pages/AccesoRestringidoPage';
import { Login } from './pages/auth/login/LoginPage';
import { ChecklistDocumentosPage } from './pages/modulo-area-sustantiva/atencion-juridica/bandeja/ChecklistDocumentosPage';



function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/login" element={<Login />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/login" replace />} />
          {/* Flujo de creación de Memorándum */}
          <Route
            path="correspondencia/nuevo-memorandum/:idCorrespondencia"
            element={
              <ProtectedRoute allowedRoles={ROUTE_ROLES['/correspondencia/nuevo-memorandum']}>
                <GenerarMemorandumPage />
              </ProtectedRoute>
            }
          />

          {/* Flujo de creación de Oficio (idéntico a Memorándum) */}
          <Route
            path="correspondencia/nuevo-oficio/:idCorrespondencia"
            element={
              <ProtectedRoute allowedRoles={ROUTE_ROLES['/correspondencia/nuevo-oficio']}>
                <GenerarOficioPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="correspondencia/registrar"
            element={
              <ProtectedRoute allowedRoles={ROUTE_ROLES['/correspondencia/registrar']}>
                <RegistrarCorrespondenciaPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="correspondencia/registradas"
            element={
              <ProtectedRoute allowedRoles={ROUTE_ROLES['/correspondencia/registradas']}>
                <CorrespondenciasRegistradasPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="correspondencia/generar-oficio/:id"
            element={
              <ProtectedRoute allowedRoles={ROUTE_ROLES['/correspondencia/generar-oficio']}>
                <GenerarOficioCorrespondenciaPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="correspondencia/generar-oficio-interno/:idCorrespondencia"
            element={
              <ProtectedRoute allowedRoles={ROUTE_ROLES['/correspondencia/generar-oficio-interno']}>
                <GenerarOficioInternoPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="correspondencia/generar-oficio-externo/:idCorrespondencia"
            element={
              <ProtectedRoute allowedRoles={ROUTE_ROLES['/correspondencia/generar-oficio-externo']}>
                <GenerarOficioExternoPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="correspondencia/contestacion/:id"
            element={
              <ProtectedRoute allowedRoles={ROUTE_ROLES['/correspondencia/contestacion']}>
                <ContestacionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="correspondencia/contestacion-oficio/:id"
            element={
              <ProtectedRoute allowedRoles={ROUTE_ROLES['/correspondencia/contestacion-oficio']}>
                <ContestacionOficioPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="correspondencia/contestacion-correspondencia/:id"
            element={
              <ProtectedRoute allowedRoles={ROUTE_ROLES['/correspondencia/contestacion-correspondencia']}>
                <ContestacionCorrespondenciaPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="correspondencia/nuevo-oficio-contestacion"
            element={
              <ProtectedRoute allowedRoles={ROUTE_ROLES['/correspondencia/nuevo-oficio-contestacion']}>
                <GenerarOficioContestacionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="correspondencia/seguimiento/:id"
            element={
              <ProtectedRoute allowedRoles={ROUTE_ROLES['/correspondencia/seguimiento']}>
                <ContestacionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="correspondencia/bandeja"
            element={
              <ProtectedRoute allowedRoles={ROUTE_ROLES['/correspondencia/bandeja']}>
                <BandejaCentralPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="atencion-juridica/bandeja-tramites-irl"
            element={
              <ProtectedRoute allowedRoles={ROUTE_ROLES['/atencion-juridica/bandeja-tramites-irl']}>
                <BandejaTramitesIrlPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="atencion-juridica/asignacion"
            element={
              <ProtectedRoute allowedRoles={ROUTE_ROLES['/atencion-juridica/asignacion']}>
                <div style={{ padding: '2rem' }}>
                  <h2>Asignación (CU-MARSU-03)</h2>
                  <p>Página en construcción</p>
                </div>
              </ProtectedRoute>
            }
          />

         <Route path="atencion-juridica/bandeja" element={
          <ProtectedRoute allowedRoles={ROUTE_ROLES['/atencion-juridica/bandeja']}>
            <BandejaGestionPage />
          </ProtectedRoute>
        } />
          

          <Route
            path="atencion-juridica/tramites-irl/:folio"
            element={
              <ProtectedRoute allowedRoles={ROUTE_ROLES['/atencion-juridica/tramites-irl']}>
                <DetalleTramiteIrlPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="correspondencia/pendiente-revision-area"
            element={
              <ProtectedRoute allowedRoles={ROUTE_ROLES['/correspondencia/pendiente-revision-area']}>
                <CorrespondenciaPendienteRevisionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="correspondencia/acuses-correspondencia"
            element={
              <ProtectedRoute allowedRoles={ROUTE_ROLES['/correspondencia/acuses-correspondencia']}>
                <ListaAcusesCorrespondenciaPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="correspondencia/acuses-oficio-por-area"
            element={
              <ProtectedRoute allowedRoles={ROUTE_ROLES['/correspondencia/acuses-oficio-por-area']}>
                <ListaAcusesOficioPage />
              </ProtectedRoute>
            }
          />

          {/* 2. Nueva ruta para Asignar Área (Paso posterior a la generación) */}
          <Route
            path="correspondencia/asignar-area/:id"
            element={
              <ProtectedRoute allowedRoles={ROUTE_ROLES['/correspondencia/asignar-area']}>
                <AsignarAreaPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="correspondencia/asignar-area-oficio/:id"
            element={
              <ProtectedRoute allowedRoles={ROUTE_ROLES['/correspondencia/asignar-area-oficio']}>
                <AsignarAreaOficioPage />
              </ProtectedRoute>
            }
          />

          {/* Consulta de Bitácora */}
          <Route
            path="correspondencia/bitacora/:id"
            element={
              <ProtectedRoute allowedRoles={ROUTE_ROLES['/correspondencia/bitacora']}>
                <BitacoraHistorica />
              </ProtectedRoute>
            }
          />

          {/* Lista de Memorandums por Área */}
          <Route
            path="correspondencia/lista-memorandums-revision"
            element={
              <ProtectedRoute allowedRoles={ROUTE_ROLES['/correspondencia/lista-memorandums-revision']}>
                <ListaMemorandumsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="correspondencia/lista-oficios-revision"
            element={
              <ProtectedRoute allowedRoles={ROUTE_ROLES['/correspondencia/lista-oficios-revision']}>
                <ListaOficiosPage />
              </ProtectedRoute>
            }
          />

          {/* Lista de Memorandums por Área (Acuse Recibo Interno) */}
          <Route
            path="correspondencia/memorandums-por-area"
            element={
              <ProtectedRoute allowedRoles={ROUTE_ROLES['/correspondencia/memorandums-por-area']}>
                <ListaMemorandumsPorAreaPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="correspondencia/oficios-por-area"
            element={
              <ProtectedRoute allowedRoles={ROUTE_ROLES['/correspondencia/oficios-por-area']}>
                <ListaOficiosPorAreaPage />
              </ProtectedRoute>
            }
          />


          <Route
            path="atencion-juridica/clasificacion/:idExpediente?"
            element={
              <ProtectedRoute allowedRoles={ROUTE_ROLES['/atencion-juridica/clasificacion']}>
                <ClasificacionJuridicaPage />
              </ProtectedRoute>
            }
          />

          {/* Módulo Área Sustantiva - Registro de Expediente */}
          <Route
            path="area-sustantiva/registro-expediente"
            element={
              <ProtectedRoute allowedRoles={ROUTE_ROLES['/area-sustantiva/registro-expediente']}>
                <RegistroExpedientePage />
              </ProtectedRoute>
            }
          />

          {/* Acceso restringido (página pública para usuarios autenticados) */}
          <Route path="acceso-restringido" element={<AccesoRestringidoPage />} />

          {/* <Route path="correspondencia" element={<CorrespondenciaPage />} /> */}
        </Route>

        <Route
        path="atencion-juridica/checklist/:folio"
        element={
          <ProtectedRoute allowedRoles={ROUTE_ROLES['/atencion-juridica/checklist']}>
            <ChecklistDocumentosPage />
          </ProtectedRoute>
        }
      />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
