import { Link } from "react-router-dom";
import "../styles/NotFound.css";

function NotFound() {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404</h1>
      <p className="not-found-message">Страница не найдена</p>
      <Link to="/" className="not-found-link">
        <button>Вернуться на главную</button>
      </Link>
    </div>
  );
}

export default NotFound;
