import { Alert, Button, Container } from "react-bootstrap";

interface CallClientPanelProps {
  noClient: boolean;
  handleCallClient: () => void;
}

function CallClientPanel({ noClient, handleCallClient }: CallClientPanelProps) {
  return (
    <Container className="mt-2">
      <Button className="primary me-2" onClick={handleCallClient}>
        Вызвать клиента
      </Button>

      {noClient && (
        <Alert variant="info" className="mt-2">
          Клиентов больше нет
        </Alert>
      )}
    </Container>
  );
}

export default CallClientPanel;
