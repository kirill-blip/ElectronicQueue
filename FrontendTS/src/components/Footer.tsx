import { Container, Navbar, NavbarProps } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface FooterProps {
  footerType?: NavbarProps;
}

function Footer({footerType}: FooterProps) {
  const [t, i18n] = useTranslation();

  return (
    <footer className="mt-auto">
      
      <Navbar
        fixed={footerType?.fixed}
        className="bg-body-secondary d-flex justify-content-center align-items-center border-top text-center"
      >
        <Container className="d-flex flex-column align-items-center">
          <div>
            <Navbar.Text>
              &copy; 2025 Astana IT College. {t('footer.copyright')}.
            </Navbar.Text>
            <div className="me-3">
              <Link to="/policy" className="text-dark-emphasis me-3">
                {t('footer.privacy')}
              </Link>
              <Link to="/contacts" className="text-dark-emphasis">
                {t('footer.contacts')}
              </Link>
            </div>
          </div>
        </Container>
      </Navbar>
    </footer>
  );
}

export default Footer;
