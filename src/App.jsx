import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { KRUG_PATH } from './config'
import Home from './pages/Home'
import GuestPage from './pages/GuestPage'
import KrugPage from './pages/KrugPage'
import AdminPage from './pages/AdminPage'
import QRCodePage from './pages/QRCodePage'
import FotobuchPreview from './pages/FotobuchPreview'
import VisitenkartePage from './pages/VisitenkartePage'
import PraesentationPage from './pages/PraesentationPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"        element={<Home />} />
        <Route path="/eintrag" element={<GuestPage />} />
        <Route path={KRUG_PATH} element={<KrugPage />} />
        <Route path="/galerie" element={<Navigate to={KRUG_PATH} replace />} />
        <Route path="/admin"   element={<AdminPage />} />
        <Route path="/qrcode"  element={<QRCodePage />} />
        <Route path="/fotobuch" element={<FotobuchPreview />} />
        <Route path="/fotobuch-print" element={<FotobuchPreview printMode />} />
        <Route path="/visitenkarte"    element={<VisitenkartePage />} />
        <Route path="/praesentation"   element={<PraesentationPage />} />
      </Routes>
    </BrowserRouter>
  )
}
