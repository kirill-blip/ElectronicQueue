import "../styles/Queue.css";

interface TicketProps {
    ticketNumber: any;
}

function TicketCard({ ticketNumber }: TicketProps) {
  return (
    <div className="card-container mb-3">
      <div className="card" style={{ width: "18rem" }}>
        <div className="card-body">
          <p className="text-number card-text text-center">{ticketNumber}</p>
        </div>
      </div>
    </div>
  );
}

export default TicketCard;
