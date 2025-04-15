import { Link } from "react-router-dom";
import "../styles/Footer.css";

function Footer() {
    return (
        <footer className="container-footer">
            <p>© 2025 Astana IT College. Все права защищены.</p>
            <div className="footer-links">
                <Link to="/policy">Политика конфиденциальности</Link>
                <Link to="/contacts">Контакты</Link>
            </div>
        </footer>
    );
}

export default Footer;