import { Alert, Button, Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";

interface CallClientPanelProps {
  noClient: boolean;
  handleCallClient: () => void;
}

function CallClientPanel({ noClient, handleCallClient }: CallClientPanelProps) {
  const {t} = useTranslation()

  return (
    <Container className="mt-2">
      {noClient && (
        <Alert variant="danger" className="mt-2">
          {t('admin-panel.no-clients')}
        </Alert>
      )}

      <Button className="primary me-2" onClick={handleCallClient}>
        {t('buttons.call-client')}
      </Button>
    </Container>
  );
}

export default CallClientPanel;
