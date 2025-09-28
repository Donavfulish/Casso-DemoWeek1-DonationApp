import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashBoardPage"
import DonationPage from "./pages/DonationPage"
import AccountBalancePage from "./pages/AboutBalancePage";
import TransactionsHistoryPage from "./pages/TransactionsHistoryPage";
import { ToastContainer } from "react-toastify";
export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground font-sans">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/:username" element={<DonationPage />} />
          <Route path="/transactions" element={<TransactionsHistoryPage />} />
          <Route path="/balance" element={<AccountBalancePage />} />
        </Routes>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  )
}