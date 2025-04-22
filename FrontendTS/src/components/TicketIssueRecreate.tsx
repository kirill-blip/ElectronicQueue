import { Button, Card } from "react-bootstrap";
import User from "../models/User";

interface TicketIssueRecreateProps {
  user: User;
  handleUpdate: () => void;
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
}

function TicketIssueRecreate({ user, handleUpdate, setRefreshKey }: TicketIssueRecreateProps) {
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
          <strong>Выдача нового талона</strong>
        </Card.Title>
        <Card.Body>
          <Card.Text>
            <strong>Имя:</strong> {user.FirstName} {user.LastName}
          </Card.Text>
          <Card.Text>
            <strong>Номер телефона:</strong> {user.PhoneNumber}
          </Card.Text>
          <Button variant="primary" onClick={handleIssueTicket}>Выдать талон</Button>
          <Button variant="warning" className="ms-2" onClick={handleUpdate}>
            Изменить данные
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}

export default TicketIssueRecreate;
