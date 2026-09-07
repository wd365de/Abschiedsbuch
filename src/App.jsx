import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import GuestPage from './pages/GuestPage'
import GalleryPage from './pages/GalleryPage'
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
        <Route path="/galerie" element={<GalleryPage />} />
        <Route path="/admin"   element={<AdminPage />} />
        <Route path="/qrcode"  element={<QRCodePage />} />
        <Route path="/fotobuch" element={<FotobuchPreview />} />
        <Route path="/visitenkarte"    element={<VisitenkartePage />} />
        <Route path="/praesentation"   element={<PraesentationPage />} />
      </Routes>
    </BrowserRouter>
  )
}
