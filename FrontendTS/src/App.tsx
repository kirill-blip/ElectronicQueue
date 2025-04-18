import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import NotFound from "./components/NotFound";
import TicketIssue from "./pages/TicketIssue";
import AdminPanel from "./pages/AdminPanel";
import { useEffect, useState } from "react";
import Queue from "./pages/Queue";
import { NavbarProps } from "react-bootstrap";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";

function App() {
  const [headerTitle, setHeaderTitle] = useState("Электронная очередь");
  const [footerType, setFooterType] = useState<NavbarProps>();

  return (
    <>
      <BrowserRouter basename="/">
        <HeaderFooterManager
          setHeaderTitle={setHeaderTitle}
          setFooterType={setFooterType}
        />
        <Header title={headerTitle} />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/ticket-issue" element={<TicketIssue />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/queue" element={<Queue />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer footerType={footerType} />
      </BrowserRouter>
    </>
  );
}

function HeaderFooterManager({
  setHeaderTitle,
  setFooterType,
}: {
  setHeaderTitle: (title: string) => void;
  setFooterType: (footerType: NavbarProps) => void;
}) {
  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname === "/admin-panel" ||
      location.pathname === "/login"
    ) {
      setHeaderTitle("Панель администратора");
    } else {
      setHeaderTitle("Электронная очередь");
    }

    if (location.pathname === "/") {
      setFooterType({ fixed: undefined });
    } else {
      setFooterType({ fixed: "bottom" });
    }
  }, [location.pathname]);

  return null;
}

export default App;
