import { Alert, Button, Card } from "react-bootstrap";
import { convertTicketNumber } from "../utils/converters";
import User from "../models/User";
import { AdminInfo } from "../models/Admin";
import { Entry, EntryStatus } from "../models/Entry";

interface TicketIssueInfoProps {
  fetchedTicketData: Entry;
  fetchedUser: User;
  fetchedAdmin: AdminInfo;
}

function TicketIssueInfo({
  fetchedTicketData,
  fetchedAdmin,
  fetchedUser,
}: TicketIssueInfoProps) {
  return (
    <div className="col-12 col-md-8 col-lg-5">
      <Card className="p-3 shadow">
        <Card.Title as="h4" className="text-center">
          <strong>
            Талон №{convertTicketNumber(fetchedTicketData.TicketNumber)}
          </strong>
        </Card.Title>
        <Card.Body>
          <Card.Text>
            <strong>Имя:</strong> {fetchedUser.FirstName} {fetchedUser.LastName}
          </Card.Text>
          <Card.Text>
            <strong>Номер телефона:</strong> {fetchedUser.PhoneNumber}
          </Card.Text>

          {fetchedTicketData.EntryStatus === EntryStatus.Processing ? (
            <Alert variant="info" className="mt-0">
              Пожалуйста, подойдите к{" "}
              <strong>столику {fetchedAdmin.TableNumber}</strong>.
            </Alert>
          ) : (
            <div>
              <Button variant="danger">Отменить запись</Button>
              <Button variant="warning ms-2">Обновить талон</Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default TicketIssueInfo;
