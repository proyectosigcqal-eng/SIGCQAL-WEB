import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './shared/MainLayout'; 
import { GenerarMemorandumPage } from './pages/modulo-correspondencia/memorandum/GenerarMemorandumPage';
import { RegistrarCorrespondenciaPage } from './pages/modulo-correspondencia/correspondencia/RegistrarCorrespondenciaPage';
import { AsignarAreaPage } from './pages/modulo-correspondencia/memorandum/AsignarAreaPage'; 
import { BitacoraHistorica } from './features/modulo-correspondencia/bitacora-historica/components/BitacoraHistorica';
import { ContestacionPage } from './pages/modulo-correspondencia/contestacion-memorandum/ContestacionPage';
import { BandejaCentralPage } from './pages/modulo-correspondencia/bandeja-central/BandejaCentralPage';
import { ListaMemorandumsPage } from './pages/modulo-correspondencia/memorandum/ListaMemorandumsPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="correspondencia/nuevo-memorandum" replace />} />
          
          {/* Flujo de creación de Memorándum */}
          <Route path="correspondencia/nuevo-memorandum" element={<GenerarMemorandumPage />} />
          <Route path="correspondencia/registrar" element={<RegistrarCorrespondenciaPage />} />
          <Route path="correspondencia/contestacion/:id" element={<ContestacionPage />} />
          <Route path="correspondencia/bandeja" element={<BandejaCentralPage />} />
          
          {/* Dejamos esta pendiente o comentada para que no falle el compilador */}
          
          {/* 2. Nueva ruta para Asignar Área (Paso posterior a la generación) */}
          <Route path="correspondencia/asignar-area/:id" element={<AsignarAreaPage />} />

          {/* Consulta de Bitácora */}
          <Route path="correspondencia/bitacora/:id" element={<BitacoraHistorica />} />

          {/* Lista de Memorandums por Área */}
          <Route path="correspondencia/lista-memorandums-revision" element={<ListaMemorandumsPage />} />

          {/* <Route path="correspondencia" element={<CorrespondenciaPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;