import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './shared/MainLayout'; 
import { GenerarMemorandumPage } from './pages/modulo-correspondencia/memorandum/GenerarMemorandumPage';
import { RegistrarCorrespondenciaPage } from './pages/modulo-correspondencia/correspondencia/RegistrarCorrespondenciaPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Redirigimos directo a nuevo-memorandum mientras creas la otra página */}
          <Route index element={<Navigate to="correspondencia/nuevo-memorandum" replace />} />
          
          <Route path="correspondencia/nuevo-memorandum" element={<GenerarMemorandumPage />} />
          <Route path="correspondencia/registrar" element={<RegistrarCorrespondenciaPage />} />
          
          {/* Dejamos esta pendiente o comentada para que no falle el compilador */}
          {/* <Route path="correspondencia" element={<CorrespondenciaPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;