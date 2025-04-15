import { useState } from "react";
import User from "../models/User";
import "../models/Entry";
import "../styles/TicketIssue.css";
import axios from "axios";

function TicketIssue() {
  const [user, setUser] = useState<User>({
    FirstName: "",
    LastName: "",
    PhoneNumber: "",
  });

  const handleSumbitButton = (e: React.FormEvent) => {
    e.preventDefault();

    axios({
      method: "POST",
      url: "http://localhost:8080/api/ticket-issue",
      data: {
        firstName: user.FirstName,
        lastName: user.LastName,
        phoneNumber: user.PhoneNumber,
      },
    })

    console.log(`First Name: ${user.FirstName}\nLast Name: ${user.LastName}\nPhone Number: ${user.PhoneNumber}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  return (
    <div className="ticket-issue-container">
      <form className="ticket-issue-form" onSubmit={handleSumbitButton}>
        <h3 className="ticket-issue-header">Запись на прием</h3>
        <p className="ticket-issue-label">Введите имя:</p>
        <input
          className="ticket-issue-input"
          name="FirstName"
          value={user.FirstName}
          onChange={handleInputChange}
        />
        <p className="ticket-issue-label">Введите фамилию:</p>
        
        <input
          className="ticket-issue-input"
          name="LastName"
          value={user.LastName}
          onChange={handleInputChange}
        />
        
        <p className="ticket-issue-label">Введите номер телефона:</p>
        <input
          className="ticket-issue-input"
          name="PhoneNumber"
          value={user.PhoneNumber}
          onChange={handleInputChange}
        />

        <button type="submit" className="ticket-issue-button">
          Записаться
        </button>
      </form>
    </div>
  );
}

export default TicketIssue;
