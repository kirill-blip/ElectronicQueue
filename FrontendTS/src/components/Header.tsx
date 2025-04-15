import { Link } from "react-router-dom";
import "../styles/Header.css";

function Header() {
    return (
        <header className="container-header">
            <div className="header-logo">
                <Link to="/">
                    <img src="/logo.png" alt="Логотип" />
                </Link>
            </div>
            <h4>Электронная очередь</h4>
        </header>
    );
}

export default Header;