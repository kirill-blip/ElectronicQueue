import { Container } from "react-bootstrap";
import "../styles/Queue.css";
import TicketCard from "../components/TicketCard";
import { useGetTickets } from "../hooks/useGetTickets";
import { useTranslation } from "react-i18next";

function Queue() {
  const { t } = useTranslation();
  const tickets = useGetTickets();

  return (
    <div>
      <Container>
        <div className="row">
          <div className="col text-center">
            <h2 className="text-center mb-2">{t("queue.ticket")}</h2>
            {tickets.length !== 0 &&
              tickets.map((ticket, index) => (
                <TicketCard key={index} ticketNumber={ticket.ticket_number} />
              ))}
          </div>
          <div className="col">
            <h2 className="text-center mb-2">{t("queue.table-number")}</h2>
            {tickets.length !== 0 &&
              tickets.map((ticket, index) => (
                <TicketCard key={index} ticketNumber={ticket.table_number} />
              ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Queue;
