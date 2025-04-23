import { Alert, Button, Card } from "react-bootstrap";
import { convertTicketNumber } from "../utils/converters";
import User from "../models/User";
import { AdminInfo } from "../models/Admin";
import { Entry, EntryStatus } from "../models/Entry";
import { useTranslation } from "react-i18next";

interface TicketIssueInfoProps {
  fetchedTicketData: Entry;
  fetchedUser: User;
  fetchedAdmin: AdminInfo;
  handleUpdate: () => void;
}

function TicketIssueInfo({
  fetchedTicketData,
  fetchedAdmin,
  fetchedUser,
  handleUpdate,
}: TicketIssueInfoProps) {
  const { t } = useTranslation();

  return (
    <div className="col-12 col-md-8 col-lg-5">
      <Card className="p-3 shadow">
        <Card.Title as="h4" className="text-center">
          <strong>
            {t('ticket-issue.ticket')} №{convertTicketNumber(fetchedTicketData.TicketNumber)}
          </strong>
        </Card.Title>
        <Card.Body>
          <Card.Text>
            <strong>{t('ticket-issue.name')}:</strong> {fetchedUser.FirstName} {fetchedUser.LastName}
          </Card.Text>
          <Card.Text>
            <strong>{t('ticket-issue.phone-number')}:</strong> {fetchedUser.PhoneNumber}
          </Card.Text>

          {fetchedTicketData.EntryStatus === EntryStatus.Processing ? (
            <Alert variant="info" className="mt-0">
              <strong>{t('ticket-issue.ticket-number')} {fetchedAdmin.TableNumber}</strong>.
            </Alert>
          ) : (
            <div>
              <Button variant="danger">{t('buttons.cancel-client-ticket')}</Button>
              <Button variant="warning ms-2" onClick={handleUpdate}>
              {t('buttons.update-client-info')}
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default TicketIssueInfo;
