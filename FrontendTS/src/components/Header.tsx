import "react-bootstrap";
import { Container, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

interface HeaderProps {
  title: string;
}

function Header({ title }: HeaderProps) {
  return (
    <header className="border-bottom bg-body-secondary">
      <Navbar sticky="top">
        <Container>
          <Link to="/">
            <img src="/logo.png" alt="Логотип" width={100} />
          </Link>
          <Navbar.Text className="text-dark-emphasis">{title}</Navbar.Text>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
