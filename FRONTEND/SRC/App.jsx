import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import NotFoundPage from "./pages/NotFoundPage"
import ScanQr from "./pages/ScanQr"
import UnreservedTicket from "./pages/UnreservedTicket"
import ReservedTicket from "./pages/ReservedTicket"
import ManageStations from "./pages/Admin/ManageStations"
import AllTickets from "./pages/AllTickets"
import Signup from "./pages/Signup"
import TicketsAnalytics from "./pages/Admin/TicketsAnalytics"
import ManageTickets from "./pages/Admin/ManageTickets"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/scan-qr" element={<ScanQr />} />
        <Route path="/unreserved-ticket" element={<UnreservedTicket />} />
        <Route path="/reserved-ticket" element={<ReservedTicket />} />
        <Route path="/my-tickets" element={<AllTickets />} />
        <Route path="/admin/manage-stations" element={<ManageStations />} />
        <Route path="/admin/tickets-analytics" element={<TicketsAnalytics />} />
        <Route path="/admin/manage-tickets" element={<ManageTickets />} />

        {/* Not Found Page */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
