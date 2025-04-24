import { Alert, Button, Card } from "react-bootstrap";
import { convertTicketNumber } from "../utils/converters";
import User from "../models/User";
import { AdminInfo } from "../models/Admin";
import { Entry, EntryStatus } from "../models/Entry";
import { useTranslation } from "react-i18next";
import { useState } from "react";

interface TicketIssueInfoProps {
  fetchedTicketData: Entry;
  fetchedUser: User;
  fetchedAdmin: AdminInfo;
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
  handleUpdate: () => void;
}

function TicketIssueInfo({
  fetchedTicketData,
  fetchedAdmin,
  fetchedUser,
  setRefreshKey,
  handleUpdate,
}: TicketIssueInfoProps) {
  const { t } = useTranslation();
  const [hasAdmin, setHasAdmin] = useState<boolean>(false);

  const handleCancelTicket = async () => {
    if (await hasTicketAdmin()) {
      setRefreshKey((prevKey) => prevKey + 1);
      return;
    }

    const status = 'cancelbyuser'

    const response = await fetch(`http://localhost:8080/api/entry/${status}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        entry_id: fetchedTicketData.EntryId
      })
    });

    if (response.ok) {
      console.log("Ticket cancelled successfully");
      setRefreshKey((prevKey) => prevKey + 1);
    } else {
      const errorData = await response.json();
      console.error("Error cancelling ticket:", errorData);
    }
  }

  const handleUpdateClient = async () => {
    if (await hasTicketAdmin()) {
      setRefreshKey((prevKey) => prevKey + 1);
      return;
    }

    handleUpdate();
  }

  const hasTicketAdmin = async () => {
    const response = await fetch("http://localhost:8080/api/entry/get", {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();

      return data.admin_id !== 0;
    } else {
      return false;
    }
  }

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

          {(fetchedTicketData.EntryStatus === EntryStatus.Processing || hasAdmin) ? (
            <Alert variant="info" className="mt-0">
              <strong>{t('ticket-issue.ticket-number')} {fetchedAdmin.TableNumber}</strong>.
            </Alert>
          ) : (
            <div>
              <Button variant="danger" onClick={handleCancelTicket}>{t('buttons.cancel-client-ticket')}</Button>
              <Button variant="warning ms-2" onClick={handleUpdateClient}>
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
