import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Main from "./components/Main";
import NotFound from "./components/NotFound";
import TicketIssue from "./components/TicketIssue";
import LoginForm from "./components/LoginForm";
import AdminPanel from "./components/AdminPanel";
import { useEffect, useState } from "react";
import Queue from "./components/Queue";

function App() {
  const [headerTitle, setHeaderTitle] = useState("Электронная очередь");

  return (
    <>
      <BrowserRouter basename="/">
        <HeaderManager setHeaderTitle={setHeaderTitle} />
        <Header title={headerTitle} />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/ticket-issue" element={<TicketIssue />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/queue" element={<Queue />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

function HeaderManager({
  setHeaderTitle,
}: {
  setHeaderTitle: (title: string) => void;
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
  }, [location.pathname]);

  return null;
}

export default App;
