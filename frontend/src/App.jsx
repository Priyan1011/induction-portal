import { Routes, Route, Link } from "react-router-dom";
import ApplicationForm from "./pages/ApplicationForm.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import InducteeDetail from "./pages/InducteeDetail.jsx";
import AdminSlots from "./pages/AdminSlots.jsx";
import AdminInterviews from "./pages/AdminInterviews.jsx";
import InducteeLogin from "./pages/InducteeLogin.jsx";
import DomainPage from "./pages/DomainPage.jsx";

function TopNav() {
  return (
    <nav className="topnav">
      <span className="brand">SCIEnT Inductions</span>
      <Link to="/">Apply</Link>
      <Link to="/domain-login">My Domain</Link>
      <Link to="/admin/login">Admin</Link>
    </nav>
  );
}

export default function App() {
  return (
    <>
      <TopNav />
      <div className="container">
        <Routes>
          {/* Module A */}
          <Route path="/" element={<ApplicationForm />} />

          {/* Module B, C(assign), F */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/inductees/:id" element={<InducteeDetail />} />
          <Route path="/admin/slots" element={<AdminSlots />} />
          <Route path="/admin/interviews" element={<AdminInterviews />} />

          {/* Module C, D — inductee-facing */}
          <Route path="/domain-login" element={<InducteeLogin />} />
          <Route path="/domain" element={<DomainPage />} />
        </Routes>
      </div>
    </>
  );
}
