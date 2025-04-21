import { Button, Card } from "react-bootstrap";
import User from "../models/User";

interface TicketIssueRecreateProps {
  user: User;
}

function TicketIssueRecreate({ user }: TicketIssueRecreateProps) {
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
          <Button variant="primary">Выдать талон</Button>
          <Button variant="warning" className="ms-2">
            Изменить данные
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}

export default TicketIssueRecreate;
