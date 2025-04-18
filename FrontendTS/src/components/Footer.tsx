import { Container, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="mt-auto">
      <Navbar
        className="bg-body-secondary d-flex justify-content-center align-items-center border-top text-center"
      >
        <Container className="d-flex flex-column align-items-center">
          <div>
            <Navbar.Text>
              &copy; 2025 Astana IT College. Все права защищены.
            </Navbar.Text>
            <div className="me-3">
              <Link to="/policy" className="text-dark-emphasis me-3">
                Политика конфиденциальности
              </Link>
              <Link to="/contacts" className="text-dark-emphasis">
                Контакты
              </Link>
            </div>
          </div>
        </Container>
      </Navbar>
    </footer>
  );
}

export default Footer;
