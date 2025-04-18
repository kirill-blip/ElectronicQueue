import { Container } from "react-bootstrap";
import "../styles/Queue.css";
import TicketCard from "../components/TicketCard";
import { useGetTickets } from "../hooks/useGetTickets";

function Queue() {
  const tickets = useGetTickets();

  return (
    <div>
      <Container>
        <div className="row">
          <div className="col text-center">
            <h2 className="text-center mb-2">Талон</h2>
            {tickets.map((ticket, index) => (
                <TicketCard key={index} ticketNumber={ticket.TicketNumber} />
            ))}
          </div>
          <div className="col">
            <h2 className="text-center mb-2">Стол</h2>
            {tickets.map((ticket, index) => (
                <TicketCard key={index} ticketNumber={ticket.TableNumber} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Queue;
