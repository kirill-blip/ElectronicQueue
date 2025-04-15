import { Link } from "react-router-dom";
import "../styles/Header.css";

interface HeaderProps {
  title: string;
}

function Header({ title }: HeaderProps) {
  return (
    <header className="container-header">
      <div className="header-logo">
        <Link to="/">
          <img src="/logo.png" alt="Логотип" />
        </Link>
      </div>
      <h4>{title}</h4>
    </header>
  );
}

export default Header;
