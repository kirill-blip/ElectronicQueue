import { Button, Card } from "react-bootstrap";
import User from "../models/User";
import { useTranslation } from "react-i18next";

interface TicketIssueRecreateProps {
  user: User;
  handleUpdate: () => void;
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
}

function TicketIssueRecreate({ user, handleUpdate, setRefreshKey }: TicketIssueRecreateProps) {
  const { t } = useTranslation();

  const handleIssueTicket = async () => {
    const response = await fetch("http://localhost:8080/api/entry/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      console.error("Failed to issue a new ticket.");
      return;
    }

    const data = await response.json();
    console.log("New ticket issued: ", data);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="col-12 col-md-8 col-lg-5">
      <Card className="p-3 shadow">
        <Card.Title as="h4" className="text-center">
          <strong>{t('ticket-issue.new-ticket')}</strong>
        </Card.Title>
        <Card.Body>
          <Card.Text>
            <strong>{t('ticket-issue.name')}:</strong> {user.FirstName} {user.LastName}
          </Card.Text>
          <Card.Text>
            <strong>{t('ticket-issue.phone-number')}:</strong> {user.PhoneNumber}
          </Card.Text>
          <Button variant="primary" onClick={handleIssueTicket}>{t('buttons.get-ticket')}</Button>
          <Button variant="warning" className="ms-2" onClick={handleUpdate}>
            {t('buttons.update-client-info')}
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}

export default TicketIssueRecreate;
