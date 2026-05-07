import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './shared/MainLayout'; 
import { GenerarMemorandumPage } from './pages/modulo-correspondencia/memorandum/GenerarMemorandumPage';
import { GenerarOficioPage } from './pages/modulo-correspondencia/oficio/GenerarOficioPage';
import { GenerarOficioPage as GenerarOficioCorrespondenciaPage } from './pages/modulo-correspondencia/correspondencia/GenerarOficioPage';
import { RegistrarCorrespondenciaPage } from './pages/modulo-correspondencia/correspondencia/RegistrarCorrespondenciaPage';
import { CorrespondenciasRegistradasPage } from './pages/modulo-correspondencia/correspondencia/CorrespondenciasRegistradasPage';
import { AsignarAreaPage } from './pages/modulo-correspondencia/memorandum/AsignarAreaPage'; 
import { AsignarAreaOficioPage } from './pages/modulo-correspondencia/oficio/AsignarAreaOficioPage'; 
import { BitacoraHistorica } from './features/modulo-correspondencia/bitacora-historica/components/BitacoraHistorica';
import { ContestacionPage } from './pages/modulo-correspondencia/contestacion-memorandum/ContestacionPage';
import { BandejaCentralPage } from './pages/modulo-correspondencia/bandeja-central/BandejaCentralPage';
import { ListaMemorandumsPage } from './pages/modulo-correspondencia/memorandum/ListaMemorandumsPage';
import { ListaOficiosPage } from './pages/modulo-correspondencia/oficio/ListaOficiosPage';
import { ListaMemorandumsPorAreaPage } from './pages/modulo-correspondencia/acuserecibointerno/ListaMemorandumsPorAreaPage';
import { CorrespondenciaPendienteRevisionPage } from './pages/modulo-correspondencia/correspondencia/CorrespondenciaPendienteRevisionPage';
import { ListaAcusesCorrespondenciaPage } from './pages/modulo-correspondencia/acusecorrespondencia/ListaAcusesCorrespondenciaPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="correspondencia/registrar" replace />} />
          
          {/* Flujo de creación de Memorándum */}
          <Route path="correspondencia/nuevo-memorandum/:idCorrespondencia" element={<GenerarMemorandumPage />} />
          {/* Flujo de creación de Oficio (idéntico a Memorándum) */}
          <Route path="correspondencia/nuevo-oficio/:idCorrespondencia" element={<GenerarOficioPage />} />
          <Route path="correspondencia/registrar" element={<RegistrarCorrespondenciaPage />} />
          <Route path="correspondencia/registradas" element={<CorrespondenciasRegistradasPage />} />
          <Route path="correspondencia/generar-oficio/:id" element={<GenerarOficioCorrespondenciaPage />} />
          <Route path="correspondencia/contestacion/:id" element={<ContestacionPage />} />
          <Route path="correspondencia/seguimiento/:id" element={<ContestacionPage />} />
          <Route path="correspondencia/bandeja" element={<BandejaCentralPage />} />
          <Route path="correspondencia/pendiente-revision-area" element={<CorrespondenciaPendienteRevisionPage />} />
          <Route path="correspondencia/acuses-correspondencia" element={<ListaAcusesCorrespondenciaPage />} />
          
          {/* Dejamos esta pendiente o comentada para que no falle el compilador */}
          
          {/* 2. Nueva ruta para Asignar Área (Paso posterior a la generación) */}
          <Route path="correspondencia/asignar-area/:id" element={<AsignarAreaPage />} />
          <Route path="correspondencia/asignar-area-oficio/:id" element={<AsignarAreaOficioPage />} />

          {/* Consulta de Bitácora */}
          <Route path="correspondencia/bitacora/:id" element={<BitacoraHistorica />} />

          {/* Lista de Memorandums por Área */}
          <Route path="correspondencia/lista-memorandums-revision" element={<ListaMemorandumsPage />} />
          <Route path="correspondencia/lista-oficios-revision" element={<ListaOficiosPage />} />

          {/* Lista de Memorandums por Área (Acuse Recibo Interno) */}
          <Route path="correspondencia/memorandums-por-area" element={<ListaMemorandumsPorAreaPage />} />
          <Route path="correspondencia/oficios-por-area" element={<ListaOficiosPage />} />

          {/* <Route path="correspondencia" element={<CorrespondenciaPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
