import "../styles/TicketIssue.css";

function TicketIssue() {
  return (
    <div className="ticket-issue-container">
      <form className="ticket-issue-form">
        <p className="ticket-issue-label">Введите имя:</p>
        <input className="ticket-issue-input" />
        <p className="ticket-issue-label">Введите фамилию:</p>
        <input className="ticket-issue-input" />
        <p className="ticket-issue-label">Введите номер телефона:</p>
        <input className="ticket-issue-input" />
        <button type="submit" className="ticket-issue-button">Записаться</button>
      </form>
    </div>
  );
}

export default TicketIssue;