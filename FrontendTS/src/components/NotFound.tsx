import { Link } from "react-router-dom";
import "../styles/NotFound.css";
import { Container, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

function NotFound() {
  const { t } = useTranslation();
  return (
    <div
      className=" d-flex justify-content-center align-items-center"
      style={{ minHeight: "calc(80vh - 56px - 56px)" }}
    >
      <Container className="col-12 col-md-8 col-lg-3 text-center">
        <h1 className="not-found-title">404</h1>
        <p className="not-found-message">{t('errors.not-found')}</p>
        <Link to="/" className="not-found-link">
          <Button variant="primary">{t('buttons.return-to-main')}</Button>
        </Link>
      </Container>
    </div>
  );
}

export default NotFound;
