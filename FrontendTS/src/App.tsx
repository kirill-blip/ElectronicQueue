import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Main from "./components/Main";
import NotFound from "./components/NotFound";
import TicketIssue from "./components/TicketIssue";
import LoginForm from "./components/LoginForm";
import AdminPanel from "./components/AdminPanel";

function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/ticket-issue" element={<TicketIssue />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
