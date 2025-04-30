import { Container, Navbar, NavbarProps } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface FooterProps {
  footerType?: NavbarProps;
}

function Footer({ footerType }: FooterProps) {
  const { t, i18n } = useTranslation();

  const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <footer className="mt-auto">
      <Navbar
        fixed={footerType?.fixed}
        className="bg-body-secondary d-flex justify-content-center align-items-center border-top text-center"
      >
        <Container className="d-flex flex-column align-items-center">
          <div className="text-center">
            <Navbar.Text>
              &copy; 2025 Astana IT College. {t('footer.copyright')}.
            </Navbar.Text>
            <div className="mt-2">
              <Link to="/policy" className="text-dark-emphasis me-3">
                {t('footer.privacy')}
              </Link>
              <Link to="/contacts" className="text-dark-emphasis">
                {t('footer.contacts')}
              </Link>
            </div>
            <div className="mt-3">
              <div className="d-flex justify-content-center">
                <select
                  className="form-select w-auto"
                  onChange={changeLanguage}
                  defaultValue={i18n.language}
                >
                  <option value="en">English</option>
                  <option value="ru">Русский</option>
                  <option value="kz">Қазақ</option>
                </select>
              </div>
            </div>
          </div>
        </Container>
      </Navbar>
    </footer>
  );
}

export default Footer;