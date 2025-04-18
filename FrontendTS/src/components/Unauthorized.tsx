import { Button, Container } from "react-bootstrap";

interface UnauthorizedProps {
  handler: () => void;
}

function Unauthorized({ handler }: UnauthorizedProps) {
  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center text-center"
      style={{ minHeight: "calc(95vh - 56px - 56px)" }}
    >
      <h2 className="text-4xl font-bold text-danger">Нет доступа</h2>
      <p className="mt-4 text-lg">
        У вас нет прав для доступа к этой странице.
      </p>
      <Button variant="primary" onClick={handler}>
        Перейти на страницу входа
      </Button>
    </Container>
  );
}

export default Unauthorized;
