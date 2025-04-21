import { Alert, Button, Container } from "react-bootstrap";

interface CallClientPanelProps {
  noClient: boolean;
  handleCallClient: () => void;
}

function CallClientPanel({ noClient, handleCallClient }: CallClientPanelProps) {
  return (
    <Container className="mt-2">
      {noClient && (
        <Alert variant="danger" className="mt-2">
          Клиентов больше нет
        </Alert>
      )}

      <Button className="primary me-2" onClick={handleCallClient}>
        Вызвать клиента
      </Button>
    </Container>
  );
}

export default CallClientPanel;
